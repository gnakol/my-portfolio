import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private configService: ConfigService) {
    const keycloakUrl = configService.get<string>('KEYCLOAK_URL');
    const keycloakRealm = configService.get<string>('KEYCLOAK_REALM');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Audience vérification désactivée car Keycloak génère "aud": "account" par défaut
      // L'issuer vérifie déjà que le token vient du bon realm
      issuer: `${keycloakUrl}/realms/${keycloakRealm}`,
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${keycloakUrl}/realms/${keycloakRealm}/protocol/openid-connect/certs`,
      }),
    });

    this.logger.log(`JWT Strategy initialized for realm: ${keycloakRealm}`);
  }

  async validate(payload: any) {
    if (!payload) {
      this.logger.error('JWT payload is empty');
      throw new UnauthorizedException('Invalid token');
    }

    // Log pour debug (à supprimer en production)
    this.logger.debug(`JWT validated for user: ${payload.preferred_username}`);

    // Extraire les informations du token Keycloak
    const user = {
      userId: payload.sub,
      username: payload.preferred_username,
      email: payload.email,
      firstName: payload.given_name,
      lastName: payload.family_name,
      roles: payload.realm_access?.roles || [],
      clientRoles: payload.resource_access || {},
    };

    return user;
  }
}
