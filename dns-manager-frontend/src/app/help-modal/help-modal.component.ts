// This file is part of the UnifiOS DNS Manager distribution (https://github.com/loredous/unifios-dns-manager).
// Copyright (c) 2023 Jeremy Banker.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
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
