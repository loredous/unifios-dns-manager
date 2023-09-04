import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClarityModule } from '@clr/angular';

@Component({
  selector: 'app-help-modal',
  templateUrl: './help-modal.component.html',
  styleUrls: ['./help-modal.component.css'],
  standalone: true,
  imports: [ClarityModule]
})

export class HelpModalComponent {

  @Input() isOpen: boolean = false;
  @Output() isOpenChange = new EventEmitter<boolean>()


}
