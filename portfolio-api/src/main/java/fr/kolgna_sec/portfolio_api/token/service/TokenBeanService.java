package fr.kolgna_sec.portfolio_api.token.service;

import fr.kolgna_sec.portfolio_api.token.bean.Token;
import fr.kolgna_sec.portfolio_api.token.dto.TokenDTO;
import fr.kolgna_sec.portfolio_api.token.mappers.TokenMapper;
import fr.kolgna_sec.portfolio_api.token.repositories.TokenRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final TokenRepository tokenRepository;

    private final TokenMapper tokenMapper;

    public Page<TokenDTO> allToken(Pageable pageable)
    {
        return this.tokenRepository.findAll(pageable)
                .map(this.tokenMapper::fromToken);
    }

    public void removeTokenById(Long idToken)
    {
        Optional<Token> token = this.tokenRepository.findById(idToken);

        if (token.isEmpty())
            throw new RuntimeException("Token witch ID : "+idToken+ " was not found");

        this.tokenRepository.delete(token.get());
    }

    @Transactional
    public void removeTokenByRange(Long startId, Long endId)
    {
        Optional<Token> startToken = this.tokenRepository.findById(startId);
        Optional<Token> endToken = this.tokenRepository.findById(endId);

        if (startToken.isPresent() && endToken.isPresent())
            this.tokenRepository.deleteByIdRange(startId, endId);
    }

    @Transactional
    public void removeTokenByCheckId(List<Long> ids)
    {
        this.tokenRepository.deleteByIds(ids);
    }


}
