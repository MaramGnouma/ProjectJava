import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TableRestaurant } from '../../Models/table-restaurant';
import {TableserviceService } from '../../Services/table.service';

@Component({
  selector: 'app-table-restaurant',
  templateUrl: './table-restaurant.component.html',
  styleUrls: ['./table-restaurant.component.css']
})
export class TableRestaurantComponent {
  tables: TableRestaurant[] = [];
  selectedTable: TableRestaurant | null = null;
  createForm: FormGroup;
  editForm: FormGroup;

  constructor(
    private tableservice: TableserviceService,
    private fb: FormBuilder
  ) {
    this.createForm = this.fb.group({
      capacite: [1],
      emplacement: ['INTERIEUR']
    });
    this.editForm = this.fb.group({
      capacite: [1],
      emplacement: ['INTERIEUR']
    });
  }

  ngOnInit() {
    this.loadTables();
  }

  loadTables() {
    this.tableservice.getTables().subscribe(data => this.tables = data);
  }

  onCreateTable() {
    if (this.createForm.valid) {
      this.tableservice.createTable(this.createForm.value).subscribe(() => {
        this.createForm.reset({ capacite: 1, emplacement: 'INTERIEUR' });
        this.loadTables();
      });
    }
  }

  onEditTable(table: TableRestaurant) {
    this.selectedTable = table;
    this.editForm.patchValue({
      capacite: table.capacite,
      emplacement: table.emplacement
    });
  }

  onUpdateTable() {
    if (this.selectedTable && this.editForm.valid) {
      this.tableservice.updateTable(this.selectedTable.id, this.editForm.value).subscribe(() => {
        this.selectedTable = null;
        this.loadTables();
      });
    }
  }

  onDeleteTable(id: number | undefined) {
    if (id && confirm('Confirmer la suppression ?')) {
      this.tableservice.deleteTable(id).subscribe(() => this.loadTables());
    }
  }

  confirmReservation(id: number | undefined) {
    if (id) {
      this.tableservice.confirmReservation(id).subscribe(() => this.loadTables());
    }
  }

  statutColor(statut: string) {
    switch (statut) {
      case 'LIBRE': return 'green';
      case 'EN_ATTENTE': return 'orange';
      case 'RESERVER': return 'red';
      default: return '';
    }
  }
}
