import { Component } from '@angular/core';
import { Route } from '@angular/router';
import { Dato } from '../dato';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  idTareaSelec: string;
  tareaEditando: Dato;
  arrayColeccionTareas: any = [{
    id: "",
    data: {} as Dato
  }];
  
  constructor(private firestoreService: FirestoreService, private router: Router) {
    // Crear una tarea vacia al empezar
    this.tareaEditando = {} as Dato;
    this.obtenerListaTareas();
  }

  obtenerListaTareas() {
    this.firestoreService.consultar("datos").subscribe((resultadoConsultaTareas) => {
      this.arrayColeccionTareas = [];
      resultadoConsultaTareas.forEach((datosTareas: any) => {
        this.arrayColeccionTareas.push({
          id: datosTareas.payload.doc.id,
          data: datosTareas.payload.doc.data()
        })
      })
    })
  }

  clickBotonInsertar() {
    this.router.navigate(['/detalle',"Nuevo"]);
    this.firestoreService.insertar("datos", this.tareaEditando)
      .then(() => {
        console.log("Tarea creada correctamente");
        this.tareaEditando = {} as Dato;
      }, (error) => {
        console.error(error)
      });
  }

  selecTarea(tareaSelec) {
    console.log("-------------------------------------------------------------------------")
    console.log("Farmaceutica ID: ",tareaSelec.id)
    console.log("Empresa: ",tareaSelec.data.empresa, "Medicamento: ",tareaSelec.data.medicamento);
    console.log("-------------------------------------------------------------------------")
    this.idTareaSelec = tareaSelec.id;
    this.tareaEditando.empresa = tareaSelec.data.empresa;
    this.tareaEditando.medicamento = tareaSelec.data.medicamento;
    this.router.navigate(['/detalle',this.idTareaSelec]);
  }

  clickBotonEliminar() {
    this.firestoreService.borrar("datos", this.idTareaSelec).then(() => {
      // Actualizar la lista completa
      this.obtenerListaTareas();
      // Limpiar datos de pantalla
      this.tareaEditando = {} as Dato;
    })
  }
  clicBotonModificar() {
    console.log(this.idTareaSelec);
    this.firestoreService.actualizar("datos", this.idTareaSelec, this.tareaEditando).then(() => {
      // Actualizar la lista completa
      this.obtenerListaTareas();
      // Limpiar datos de pantalla
      this.tareaEditando = {} as Dato;
    })
  }
}
