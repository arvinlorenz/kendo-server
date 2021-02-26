import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { of } from 'rxjs';
import { DataSheetService } from './data-sheet.service';

@Component({
  selector: 'app-data-sheet',
  templateUrl: './data-sheet.component.html',
  styleUrls: ['./data-sheet.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DataSheetComponent implements OnInit {
  expandedKeys: any[] = ['0'];
  selectedKeys: any[] = ['0_0'];
  createVersionButtonDisable = true;
  currentValue : any  = undefined;;
  initialValue: any  = undefined;
  value = '';
  versions: any[] = [];
  constructor(private dataSheetService: DataSheetService) { }

  hasChildren = (item: any) => item.items && item.items.length > 0;
  fetchChildren = (item: any) => of(item.items);

  valueChange(value: any): void {

   this.currentValue = value
   this.createVersionButtonDisable = this.currentValue === this.initialValue ? true : false;
  }

  handleSelection({ index }: any): void {
    this.selectedKeys = [index];
    if (this.selectedKeys[0].split('_').length === 1) {  this.selectedKeys = [`${index}_0`] }
    const date = this.versions[this.selectedKeys[0].split('_')[0]].text;
    const time = this.versions[this.selectedKeys[0].split('_')[0]].items[this.selectedKeys[0].split('_')[1]].text;

    const thisDate = this.versions.find(v => v.text === date);

    this.value = thisDate.items.find((item: any) => item.text === time).value;
    this.initialValue = this.value;

  }
  isItemSelected = (_: any, index: string) => this.selectedKeys.indexOf(index) > -1;

  createVersion() {

    this.initialValue = this.currentValue;
    this.createVersionButtonDisable = this.currentValue === this.initialValue ? true : false;
    const nowDate = new Date().toDateString();
    const nowTime = new Date().toLocaleTimeString();

    const existingInDate = this.versions.find(v => v.text === nowDate);
    if(existingInDate) {
      const index = this.versions.findIndex(v => v.text === nowDate);
      let updatedInDate = {...existingInDate};
      updatedInDate.items.unshift({text:nowTime, value: this.currentValue});
      this.versions[index] = updatedInDate;

    } else {
      this.versions.unshift({text:nowDate, items: [{ text: nowTime, value: this.currentValue }]});
    }
    this.selectedKeys = ['0_0'];
    this.value = this.currentValue;

  }
  ngOnInit(): void {
    this.dataSheetService.getVersions().subscribe(versions => {
     this.versions = versions;
     this.initialValue = this.versions[0].items[0].value;
      this.value = this.initialValue;
      this.currentValue = this.value;

      this.createVersionButtonDisable = this.currentValue === this.initialValue ? true : false;
    })


  }

}
