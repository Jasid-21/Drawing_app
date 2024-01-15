import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SVGWorkspaceViewComponent } from './svgworkspace-view.component';

describe('SVGWorkspaceViewComponent', () => {
  let component: SVGWorkspaceViewComponent;
  let fixture: ComponentFixture<SVGWorkspaceViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SVGWorkspaceViewComponent]
    });
    fixture = TestBed.createComponent(SVGWorkspaceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
