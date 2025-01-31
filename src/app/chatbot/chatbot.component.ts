import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-chatbot',
  standalone: true, // ✅ Esto lo hace independiente
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, MatIconModule], // Importa los módulos necesarios
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  userInput: string = '';
  messages: { text: string; sender: 'user' | 'bot' }[] = [];
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  responses: { [key: string]: string } = {
    "hola": "¡Hola! ¿En qué puedo ayudarte?",
    "cómo estás": "Soy un chatbot, ¡pero estoy aquí para ayudarte!",
    "adiós": "Hasta luego, que tengas un buen día.",
    "default": "No entiendo tu pregunta, intenta con otra."
  };

  sendMessage() {
    if (this.userInput.trim() === '') return;

    const userMessage = this.userInput.toLowerCase();
    this.messages.push({ text: this.userInput, sender: 'user' });
    this.userInput = '';

    const response = this.responses[userMessage] || this.responses["default"];
    setTimeout(() => {
      this.messages.push({ text: response, sender: 'bot' });
    }, 500);

    this.userInput = '';
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
  
    if (file) {
      this.selectedFile = file;
  
      // Mostrar vista previa de la imagen
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file); // Aseguramos que file no es null aquí
    }
  }
  

  uploadImage() {
    if (this.selectedFile) {
      console.log('Imagen subida:', this.selectedFile.name);
      this.messages.push({ sender: 'user', text: `Imagen subida: ${this.selectedFile.name}` });
      this.selectedFile = null;
      this.imagePreview = null;
    }
  }
}



