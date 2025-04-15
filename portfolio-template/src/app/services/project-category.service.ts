import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectCategoryService {
  private categories = [
    { 
      name: 'Développement', 
      icon: 'code', 
      color: '#4f46e5', 
      type: 'development',
      default: true // Marqueur pour la catégorie par défaut
    },
    { 
      name: 'Administration système et réseau', 
      icon: 'dns', 
      color: '#10b981', 
      type: 'sysadmin' 
    },
    { 
      name: 'Projet en cours', 
      icon: 'pending_actions', 
      color: '#3b82f6', 
      type: 'current' 
    },
    { 
      name: 'Projet court terme', 
      icon: 'event_available', 
      color: '#ec4899', 
      type: 'short-term' 
    },
    { 
      name: 'Projet long terme', 
      icon: 'calendar_today', 
      color: '#f59e0b', 
      type: 'long-term' 
    }
  ];

  getCategories() {
    return this.categories;
  }

  getCategoryByType(type: string) {
    return this.categories.find(c => c.type === type);
  }

  getProjectCategory(project: any) {
    if (!project.skillsAcquired) {
      return this.getDefaultCategory();
    }
    
    const match = project.skillsAcquired.match(/^\[([^\]]+)\]/);
    if (match) {
      return this.getCategoryByType(match[1]) || this.getDefaultCategory();
    }
    
    return this.getDefaultCategory();
  }

  private getDefaultCategory() {
    return this.categories.find(c => c.default) || this.categories[0];
  }
}