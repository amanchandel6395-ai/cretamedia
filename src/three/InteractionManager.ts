import * as THREE from 'three';
import { StudioEnvironment, InteractiveScreenTarget } from './StudioEnvironment';
import { DEPARTMENTS, DepartmentInfo } from '../data/studioData';

export class InteractionManager {
  private camera: THREE.PerspectiveCamera;
  private environment: StudioEnvironment;
  private domElement: HTMLElement;
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;

  public onSelectDepartment?: (dept: DepartmentInfo) => void;
  public onSelectProject?: (projectId: string) => void;

  constructor(camera: THREE.PerspectiveCamera, environment: StudioEnvironment, domElement: HTMLElement) {
    this.camera = camera;
    this.environment = environment;
    this.domElement = domElement;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.setupListeners();
  }

  private setupListeners() {
    this.domElement.addEventListener('click', (e) => {
      this.handleClick(e);
    });

    this.domElement.addEventListener('pointermove', (e) => {
      this.handleHover(e);
    });
  }

  private updateMouse(e: MouseEvent) {
    const rect = this.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  private handleClick(e: MouseEvent) {
    this.updateMouse(e);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const hitTargets = this.environment.interactiveTargets.map(t => t.mesh);
    const intersects = this.raycaster.intersectObjects(hitTargets, false);

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object as THREE.Mesh;
      const target = this.environment.interactiveTargets.find(t => t.mesh === hitMesh);

      if (target) {
        if (target.type === 'department') {
          const dept = DEPARTMENTS.find(d => d.id === target.departmentId);
          if (dept && this.onSelectDepartment) {
            this.onSelectDepartment(dept);
          }
        } else if (target.type === 'project' && target.projectId) {
          if (this.onSelectProject) {
            this.onSelectProject(target.projectId);
          }
        } else if (target.type === 'portal' && target.url) {
          window.open(target.url, '_blank', 'noopener,noreferrer');
        }
      }
    }
  }

  private handleHover(e: MouseEvent) {
    this.updateMouse(e);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const hitTargets = this.environment.interactiveTargets.map(t => t.mesh);
    const intersects = this.raycaster.intersectObjects(hitTargets, false);

    if (intersects.length > 0) {
      this.domElement.style.cursor = 'pointer';
    } else {
      this.domElement.style.cursor = 'default';
    }
  }
}
