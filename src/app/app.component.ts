import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FormsModule} from "@angular/forms";
import {Item} from "./interface/donnée.interface";
import { ngxCsv } from 'ngx-csv/ngx-csv';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent {
  input = '';
  result = '';
  produit= '';
  tabItems: Item[] = [];
  unite='';

  constructor() {
    if (localStorage.getItem("inventaire")) {
      this.tabItems = JSON.parse(localStorage.getItem("inventaire") || '{}');
    }

  }


  pressNum(num: string) {

    //Do Not Allow . more than once
    if (num==".") {
      if (this.input !="" ) {

        const lastNum=this.getLastOperand()
        console.log(lastNum.lastIndexOf("."))
        if (lastNum.lastIndexOf(".") >= 0) return;
      }
    }
    if (num=="0") {
      if (this.input=="" ) {
        return;
      }
      const PrevKey = this.input[this.input.length - 1];
      if (PrevKey === '/' || PrevKey === '*' || PrevKey === '-' || PrevKey === '+')  {
        return;
      }
    }

    this.input = this.input + num



  }

  getLastOperand() {
    let pos:number;
    console.log(this.input)
    pos=this.input.toString().lastIndexOf("+")
    if (this.input.toString().lastIndexOf("-") > pos) pos=this.input.lastIndexOf("-")
    if (this.input.toString().lastIndexOf("*") > pos) pos=this.input.lastIndexOf("*")
    if (this.input.toString().lastIndexOf("/") > pos) pos=this.input.lastIndexOf("/")
    console.log('Last '+this.input.substr(pos+1))
    return this.input.substr(pos+1)
  }


  pressOperator(op: string) {

    //Do not allow operators more than once
    const lastKey = this.input[this.input.length - 1];
    if (lastKey === '/' || lastKey === '*' || lastKey === '-' || lastKey === '+')  {
      return;
    }

    this.input = this.input + op
    this.calcAnswer();
  }


  clear() {
    if (this.input !="" ) {
      this.input=this.input.substr(0, this.input.length-1)
    }
  }

  allClear() {
    this.result = '';
    this.input = '';
  }

  calcAnswer() {
    let formula = this.input;

    let lastKey = formula[formula.length - 1];

    if (lastKey === '.')  {
      formula=formula.substr(0,formula.length - 1);
    }

    lastKey = formula[formula.length - 1];

    if (lastKey === '/' || lastKey === '*' || lastKey === '-' || lastKey === '+' || lastKey === '.')  {
      formula=formula.substr(0,formula.length - 1);
    }

    console.log("Formula " +formula);
    this.result = eval(formula);
  }

  getAnswer() {
    this.calcAnswer();
    if (this.input=="0") this.input="";
    console.log(this.result);

  }

  displayInventaire(){

  }

  add(){

    switch (this.unite) {
      case "1":
        this.unite="m2";
        break;
      case "2":
        this.unite="ml";
        break;
      case "3":
        this.unite="m3";
        break;
      case "4":
        this.unite="U";
        break;
      case "5":
        this.unite="l";
        break;
    }

    let object = {
      produit: this.produit,
      quantite: this.input,
      unite: this.unite
    }
    this.tabItems.push(object);
    localStorage.setItem("inventaire", JSON.stringify(this.tabItems));
    console.log(this.tabItems);
  }

  saveCSV(){
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Inventaire',
      useBom: true,
      noDownload: false,
      headers: ["Nom du produit", "Quantité", "Unité"]
    };

    var csvContent=new ngxCsv(this.tabItems, 'Inventaire',options);

  }

  print(){



  }

  importCSV(){

  }


}
