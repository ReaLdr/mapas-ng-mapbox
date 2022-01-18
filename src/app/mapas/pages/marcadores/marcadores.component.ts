import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from'mapbox-gl';

interface Marcadorcolor{
  color: string;
  marker?: mapboxgl.Marker;
  centro?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
    .mapa-container {
      width: 100%;
      height: 100%;
    }

    .list-group{
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99;
    }
    li {
      cursor: pointer;
    }
    `
  ]
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapaZoom') divMapa!: ElementRef

  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  centerMapa: [number, number] = [ -99.20729912507025, 19.392795749516015 ];

  // Arreglo de marcadores
  marcadores: Marcadorcolor[] = [];

  constructor() { }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.centerMapa,
      zoom: this.zoomLevel
    });

    this.leerMarcadoresLocalStorage();

    // const markerHtml: HTMLElement = document.createElement('div');
    // markerHtml.innerHTML = 'Hola mundo';

    /* const marker = new mapboxgl.Marker({
      element: markerHtml
    }) */
    /* new mapboxgl.Marker()
        .setLngLat( this.centerMapa )
        .addTo( this.mapa ); */
    
    
  }

  agregarMarcador(){
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    
    const nuevoMarcador = new mapboxgl.Marker({
            draggable: true,
            color
          })
          .setLngLat( this.centerMapa )
          .addTo( this.mapa );
          
    this.marcadores.push({
      color,
      marker: nuevoMarcador
    });

    this.guardarMarcadoresLocalStorage();

    nuevoMarcador.on('dragend', () =>{
      this.guardarMarcadoresLocalStorage();
    });
    
  }

  irMarcador( marker: mapboxgl.Marker ) {

    this.mapa.flyTo({
      center: marker.getLngLat()
    });  

  }

  guardarMarcadoresLocalStorage(){

    const lngLatArr:Marcadorcolor[] = [];

    this.marcadores.forEach(m => {
      const color = m.color;
      const { lng, lat } = m.marker!.getLngLat();
      lngLatArr.push({
        color,
        centro: [lng, lat]
      });
    });

    localStorage.setItem('marcadores', JSON.stringify(lngLatArr));

  }

  leerMarcadoresLocalStorage(){

    if( !localStorage.getItem('marcadores') ){
      return;
    }

    const lngLatArr: Marcadorcolor[] = JSON.parse( localStorage.getItem('marcadores')! );

    lngLatArr.forEach( m => {
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable: true,
      }).setLngLat( m.centro! )
      .addTo( this.mapa )
      
      
      this.marcadores.push( {
        marker: newMarker,
        color: m.color
      });

      newMarker.on('dragend', () =>{
        this.guardarMarcadoresLocalStorage();
      });

    });


  }

  borrarMarcador( i: number ){
    this.marcadores[i].marker?.remove();
    this.marcadores.splice( i, 1 )
    this.guardarMarcadoresLocalStorage()
  }

}
