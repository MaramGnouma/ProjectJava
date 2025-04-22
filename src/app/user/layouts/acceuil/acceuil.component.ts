import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-acceuil',
  templateUrl: './acceuil.component.html',
  styleUrls: ['./acceuil.component.css','../../../../assets/css/style.css','../../../../assets/css/style1.css']
})
export class AcceuilComponent  implements OnInit, OnDestroy {
  currentIndex = 0;
  private intervalId: any;

  slides = [
    {
      image: '../../../../assets/slideAcceuil/banniere2.jpg',
      subtitle: 'Traditionnel & Hygiène',
      title: 'Pour l\'amour de <br>la bonne cuisine',
      text: 'Venez en famille et ressentez la joie d\'un repas savoureux',
      btnText: 'Voir notre menu',
      btnLink: '/user/menu'
    },
    {
      image: '../../../../assets/slideAcceuil/img2.jpg',
      subtitle: 'expérience délicieuse',
      title: 'Des saveurs inspirées <br>par les saisons',
      text: 'Venez en famille et ressentez la joie d\'un repas savoureux',
      btnText: 'Voir notre menu',
      btnLink: '/user/menu'
    },
    {
      image: '../../../../assets/slideAcceuil/img3.jpg',
      subtitle: 'incroyable & délicieux',
      title: 'Chaque saveur <br>raconte une histoire',
      text: 'Venez en famille et ressentez la joie d\'un repas savoureux',
      btnText: 'Voir notre menu',
      btnLink: '/user/menu'
    }
  ];

  ngOnInit() {
    this.startSlider();
  }

  ngOnDestroy() {
    this.stopSlider();
  }

  startSlider() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopSlider() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }
}
