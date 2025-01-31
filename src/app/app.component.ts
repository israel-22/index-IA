import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ChatbotComponent } from './chatbot/chatbot.component'; // ✅ Importar el componente

@Component({
  selector: 'app-root',
  standalone: true,  // ✅ Confirma que AppComponent es standalone
  imports: [ChatbotComponent], // ✅ Importa ChatbotComponent aquí
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'inteligencia-artificial';
}

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule
  ]
}
)
export class AppModule { }



