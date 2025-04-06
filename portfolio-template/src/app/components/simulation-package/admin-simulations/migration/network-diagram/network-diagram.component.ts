import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule, CdkDragEnd } from '@angular/cdk/drag-drop';

type Node = {
  id: number;
  label: string;
  x: number;
  y: number;
  state: string;
  dependencies?: number[];
};

type Connection = {
  x1: number; y1: number;
  x2: number; y2: number;
  status?: 'valid' | 'invalid';
};

@Component({
  selector: 'app-network-diagram',
  standalone: true,
  templateUrl: './network-diagram.component.html',
  styleUrls: ['./network-diagram.component.scss'],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    DragDropModule
  ]
})
export class NetworkDiagramComponent implements OnInit {
  nodes: Node[] = [
    { 
      id: 1, 
      label: 'Server A', 
      x: 100, y: 100, 
      state: '', 
      dependencies: [2] 
    },
    { id: 2, label: 'Database', x: 300, y: 200, state: '' },
    { 
      id: 3, 
      label: 'Load Balancer', 
      x: 500, y: 100, 
      state: '',
      dependencies: [2] 
    }
  ];

  connections: Connection[] = [];
  downtimeScore: number = 100;
  migrationLogs: string[] = [];

  ngOnInit(): void {
    this.updateConnections();
  }

  // AJOUT DE LA MÉTHODE MANQUANTE
  showNodeDetails(node: Node): void {
    const deps = node.dependencies?.map(depId => 
      this.nodes.find(n => n.id === depId)?.label || '?'
    ).join(', ') || 'Aucune';

    alert(`🔍 Détails du nœud :
Label: ${node.label}
ID: ${node.id}
Dépendances: ${deps}
Position: (${node.x}, ${node.y})`);
  }

  onDragEnded(event: CdkDragEnd, node: Node): void {
    const targetNode = this.findClosestNode(event.source.getFreeDragPosition());
    const isValid = this.validateMigration(node, targetNode);

    if (isValid) {
      node.x = event.source.getFreeDragPosition().x;
      node.y = event.source.getFreeDragPosition().y;
      node.state = 'success';
      this.downtimeScore -= 1;
      this.migrationLogs.unshift(`✅ ${node.label} → ${targetNode.label} (Score: ${this.downtimeScore})`);
    } else {
      node.state = 'error';
      this.downtimeScore -= 10;
      this.migrationLogs.unshift(`❌ ${node.label} dépend de ${this.getDependencyNames(node)} !`);
      event.source.reset();
    }

    setTimeout(() => node.state = '', 1500);
    this.updateConnections();
  }

  private getDependencyNames(node: Node): string {
    return node.dependencies?.map(depId => 
      this.nodes.find(n => n.id === depId)?.label || 'Unknown'
    ).join(', ') || '';
  }

  private findClosestNode(position: { x: number, y: number }): Node {
    return this.nodes.reduce((prev, curr) => {
      const prevDist = Math.sqrt(Math.pow(prev.x - position.x, 2) + Math.pow(prev.y - position.y, 2));
      const currDist = Math.sqrt(Math.pow(curr.x - position.x, 2) + Math.pow(curr.y - position.y, 2));
      return prevDist < currDist ? prev : curr;
    });
  }

  private validateMigration(source: Node, target: Node): boolean {
    if (!source.dependencies) return true;
    return source.dependencies.every(depId => 
      this.nodes.some(n => n.id === depId && n.x === target.x && n.y === target.y)
    );
  }

  private updateConnections(): void {
    this.connections = this.nodes.flatMap(source => 
      (source.dependencies || []).map(depId => {
        const target = this.nodes.find(n => n.id === depId)!;
        return {
          x1: source.x + 40, y1: source.y + 40,
          x2: target.x + 40, y2: target.y + 40,
          status: this.validateMigration(source, target) ? 'valid' : 'invalid'
        };
      })
    );
  }

  getGaugeColor(): string {
    if (this.downtimeScore > 75) return '#00ff41';
    if (this.downtimeScore > 50) return '#ffcc00';
    return '#ff3300';
  }
}