import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl'

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
    .mapa-container {
      width: 100%;
      height: 100%;
    }

    .row{
      background-color: white;
      border-radius: 5px;
      bottom: 50px;
      left: 50px;
      padding: 10px;
      position: fixed;
      z-index: 999;
      width: 400px;
    }
    `
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapaZoom') divMapa!: ElementRef
  mapa!: mapboxgl.Map;
  zoomLevel: number = 10;
  centerMapa: [number, number] = [ -99.20729912507025, 19.392795749516015 ];

  constructor( ) {}

  ngOnDestroy(): void {
    this.mapa.off('zoom', () => {});
    this.mapa.off('zoomend', () => {});
    this.mapa.off('move', () => {});
  }

  ngAfterViewInit(): void {

    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.centerMapa,
      zoom: this.zoomLevel
    })

    this.mapa.on( 'zoom', (evt)=>{
      this.zoomLevel = this.mapa.getZoom();
    })
   
    this.mapa.on( 'zoomend', (evt)=>{
      if(this.mapa.getZoom() > 18){
        this.mapa.zoomTo( 18 );
      }
    });

    this.mapa.on('move', (event) =>{
      const target = event.target;
      const { lng, lat } = target.getCenter();
      this.centerMapa = [lng, lat];
    })

  }

  zoomOut (){
    this.mapa.zoomOut();
  }
  
  zoomIn (){
    this.mapa.zoomIn();
  }

  zoomCambio( valor: string ){
    this.mapa.zoomTo( Number(valor) );
  }

}
