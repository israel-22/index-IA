import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { style } from '@angular/animations';


@Component({
  selector: 'app-chatbot',
  standalone: true, // ✅ Esto lo hace independiente
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, MatIconModule], // Importa los módulos necesarios
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent  {
  userInput: string = '';
  messages: { text: string; sender: 'user' | 'bot' }[] = [];
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  selectedFileName: string = '';
  selectedFileType: string = '';

  responses: { [key: string]: string  } = {
    "hola": "¡Hola! ¿En qué puedo ayudarte?",
    "cómo estás": " Estoy bien, gracias por preguntar. Soy un chatbot, ¡pero estoy aquí para ayudarte!",
    "como estas": "Soy un chatbot, ¡pero estoy aquí para ayudarte!",
    "que puedes hacer": "Puedo responder a preguntas de salud, como 'hola', 'cómo estás', 'adiós' o 'adios'.",
    "quien eres":"Soy tu papi chatbot, jajajajaja!!!! No, solo soy tu papi chatbot",
    "estas vivo":"Solo en tu corazon guapo, tu papi chatbot es el mejor de todos tus panas, niñ@ rata :)",
    "adiós" : "Hasta luego, que tengas un buen día.",
    "adios" : "Hasta luego, que tengas un buen día.",
    "hola guapo": "Como esta mi rey, cuentame mijo en que te ayudo:) ",
    "te quiero":"te lo agradesco mucho, pero te recomiendo visitar un Psiquiatra, hay cuatro sanatorios serca de ti",
    "default": "No entiendo tu pregunta, intenta con otra."
  };

  private isRecording: boolean = false;
  private recognition: any;
  private isRecognizing: boolean = false;
  private visionModelActive: string | null = null;

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
      this.selectedFileName = file.name;
      this.selectedFileType = file.type;

      // Mostrar vista previa de la imagen
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
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

  toggleRecording() {
    const recordButton = document.getElementById('recordButton') as HTMLButtonElement;

    if (!this.isRecognizing) {
      this.recognition.start();
      this.isRecognizing = true;
      recordButton.classList.add('recording');
    } else {
      this.recognition.stop();
      this.isRecognizing = false;
      recordButton.classList.remove('recording');
    }
  }

  toggleVisionModel(model: string) {
    this.visionModelActive = model;
    alert('Modelo de visión activado: ${model}');
  }
}



