import { Component, EventEmitter, HostListener, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { TypeheadItemModel } from '../shared/typehead.item.model';

@Component({
  selector: 'app-dropdown-item',
  templateUrl: './dropdown-item.component.html',
  styleUrls: ['./dropdown-item.component.scss']
})
export class DropdownItemComponent implements OnInit {
  @Input() template: TemplateRef<any>;
  @Input() data: TypeheadItemModel;
  @Input() active: number;
  @Input() index: number;
  @Output() choseItem = new EventEmitter<TypeheadItemModel> ();
  @Output() mouseHover = new EventEmitter<number> ();
  constructor() { }

  ngOnInit() {
  }

  select() {
    this.choseItem.emit(this.data);
  }

  getActive(): boolean {
    return this.active === this.index;
  }

  isChoose() {
    if (this.getActive()) {
      this.select();
    }
  }

  isHover() {
    this.mouseHover.emit(this.index);
  }

  @HostListener('document:keydown.enter') public setItem () {
    this.isChoose();
  }

}
