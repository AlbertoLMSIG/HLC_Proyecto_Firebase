import { Component } from '@angular/core';
import { Dato } from '../dato';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tareaEditando: Dato;
  arrayColeccionTareas: any = [{
    id: "",
    data: {} as Dato
  }];
  constructor(private firestoreService: FirestoreService) {
    // Crear una tarea vacia al empezar
    this.tareaEditando = {} as Dato;

    this.obtenerListaTareas();
  }

  clickBotonInsertar(){
    this.firestoreService.insertar("datos",this.tareaEditando)
    .then(()=>{
      console.log("Tarea creada correctamente");
      this.tareaEditando = {} as Dato;
    },(error) =>{
      console.error(error)
    });
  }

  obtenerListaTareas(){
    this.firestoreService.consultar("datos").subscribe((resultadoConsultaTareas) => {
      this.arrayColeccionTareas = [];
      resultadoConsultaTareas.forEach((datosTareas: any) => {
        this.arrayColeccionTareas.push({
          id: datosTareas.payload.doc.id,
          data: datosTareas.payload.doc.data()
        })
      })
    }
    )
  }
}
