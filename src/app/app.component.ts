import {Component, HostListener} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FormsModule} from "@angular/forms";
import {Item} from "./interface/donnée.interface";
import { ngxCsv } from 'ngx-csv/ngx-csv';
import {CommonModule} from "@angular/common";



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent {
  input = '';
  result = '';
  produit= '';
  tabItems: Item[] = [];
  unite='';
  view:string="";


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if(event.target.innerWidth<1180){
      this.view="saisie";
    }
    else{
      this.view="";
    }
  }

  constructor() {
    if (localStorage.getItem("inventaire")) {
      this.tabItems = JSON.parse(localStorage.getItem("inventaire") || '{}');
    }

  }

  ngAfterViewInit(){
    if(window.innerWidth<1180){
      this.view="saisie";
    }
    else{
      this.view="";
    }
  }

  changeViewInventaire(){
    this.view="inventaire";
  }

  changeViewSaisie(){
    this.view="saisie";
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
    this.produit = '';
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
      id: Math.random().toString(36).substr(2, 9),
      produit: this.produit,
      quantite: this.result,
      unite: this.unite
    }
    this.tabItems.push(object);
    localStorage.setItem("inventaire", JSON.stringify(this.tabItems));
    console.log(this.tabItems);

  }

  update(item: Item){
    this.result=item.quantite;
    this.produit=item.produit;
    switch (item.unite) {
      case "m2":
        this.unite="1";
        break;
      case "ml":
        this.unite="2";
        break;
      case "m3":
        this.unite="3";
        break;
      case "U":
        this.unite="4";
        break;
      case "l":
        this.unite="5";
        break;
    }


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
    let htmlReport = "<table>";
    htmlReport += "<tr>";
    htmlReport += "<th>Produit</th>";
    htmlReport += "<th>Quantité</th>";
    htmlReport += "<th>Unité</th>";
    htmlReport += "</tr>";
    for (let i = 0; i < this.tabItems.length; i++) {
      htmlReport += "<tr>";
      htmlReport += "<td>" + this.tabItems[i].produit + "</td>";
      htmlReport += "<td>" + this.tabItems[i].quantite + "</td>";
      htmlReport += "<td>" + this.tabItems[i].unite + "</td>";
      htmlReport += "</tr>";
    }
    htmlReport += "</table>";

    window.document.write(htmlReport);
    window.document.close();
    window.print();



  }

  importCSV(){

  }


}
