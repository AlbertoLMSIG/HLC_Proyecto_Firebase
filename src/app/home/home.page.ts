import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Dato } from '../dato';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  idDatoSelec: string;
  tareaEditando: Dato;
  arrayColeccionDato: any = [
    {
      id: '',
      data: {} as Dato,
    },
  ];
  constructor(private firestoreService: FirestoreService, private router:Router) {
    this.tareaEditando = {} as Dato;

    this.obtenerListaDatos();
  }

  clickBotonInsertar() {    this.router.navigate(['/detalle', "nuevo"]);

}

obtenerListaDatos() {
  this.firestoreService
    .consultar('datos')
    .subscribe((resultadoConsultaDatos) => {
      this.arrayColeccionDato = [];
      resultadoConsultaDatos.forEach((datosFarmaceutica: any) => {
        this.arrayColeccionDato.push({
          id: datosFarmaceutica.payload.doc.id,
          data: datosFarmaceutica.payload.doc.data()
        });
      });
    });
}


selecFarmaceutica(FarmaceuticaSelec) {
  console.log("Televisor seleccionado: ");
  console.log(FarmaceuticaSelec);
  this.idDatoSelec = FarmaceuticaSelec.id;
  this.tareaEditando.empresa = FarmaceuticaSelec.data.empresa;
  this.tareaEditando.medicamento = FarmaceuticaSelec.data.medicamento;
  this.router.navigate(['/detalle', this.idDatoSelec]);
}

clicBotonBorrar() {
  this.firestoreService.borrar("datos", this.idDatoSelec).then(() => {
    // Actualizar la lista completa
    this.obtenerListaDatos();
    // Limpiar datos de pantalla
    this.tareaEditando = {} as Dato;
  })
}


clicBotonModificar() {
  this.firestoreService.actualizar("datos", this.idDatoSelec, this.tareaEditando).then(() => {
    // Actualizar la lista completa
    this.obtenerListaDatos();
    // Limpiar datos de pantalla
    this.tareaEditando = {} as Dato;
  })
}

}
