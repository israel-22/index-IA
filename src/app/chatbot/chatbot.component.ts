



































import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, MatIconModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  userInput: string = '';
  messages: { text: string; sender: 'user' | 'bot'; time?: string }[] = []; // Agregamos la propiedad `time`
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  selectedFileName: string = '';
  selectedFileType: string = '';
  private visionModelActive: string | null = null;

  private isRecording: boolean = false;
  private recognition: any;
  private isRecognizing: boolean = false;

  responses: { [key: string]: string } = {
    "hola": "¡Hola! ¿En qué puedo ayudarte?",
    "cómo estás": "Estoy bien, gracias por preguntar. Soy un chatbot, ¡pero estoy aquí para ayudarte!",
    "como estas": "Soy un chatbot, ¡pero estoy aquí para ayudarte!",
    "que puedes hacer": "Puedo responder a preguntas de salud, como 'hola', 'cómo estás', 'adiós' o 'adios'.",
    "quien eres": "Soy tu papi chatbot, jajajajaja!!!! No, solo soy tu papi chatbot",
    "estas vivo": "Solo en tu corazon guapo, tu papi chatbot es el mejor de todos tus panas, niñ@ rata :)",
    "adiós": "Hasta luego, que tengas un buen día.",
    "adios": "Hasta luego, que tengas un buen día.",
    "hola guapo": "Como esta mi rey, cuentame mijo en que te ayudo:) ",
    "te quiero": "te lo agradesco mucho, pero te recomiendo visitar un Psiquiatra, hay cuatro sanatorios serca de ti",
    "default": "No entiendo tu pregunta, intenta con otra."
  };

  ngOnInit() {
    this.initializeRecognition();
  }

  // Función para obtener la fecha y hora actual
  getCurrentTime(): string {
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  initializeRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'es-ES';

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.userInput = transcript;
        this.sendMessage();
      };

      this.recognition.onerror = (event: any) => {
        console.error('Error en el reconocimiento de voz:', event.error);
      };

      this.recognition.onend = () => {
        this.isRecognizing = false;
        const recordButton = document.getElementById('recordButton') as HTMLButtonElement;
        recordButton.classList.remove('recording');
      };
    } else {
      console.warn('El reconocimiento de voz no es compatible con este navegador.');
    }
  }

  toggleRecording() {
    const recordButton = document.getElementById('recordButton') as HTMLButtonElement;
    if (this.isRecognizing) {
      this.recognition.stop();
      this.isRecognizing = false;
      recordButton.classList.remove('recording');
    } else {
      this.recognition.start();
      this.isRecognizing = true;
      recordButton.classList.add('recording');
    }
  }

  sendMessage() {
    if (this.userInput.trim() === '') return;

    const userMessage = this.userInput.toLowerCase();
    const currentTime = this.getCurrentTime(); // Obtener la hora actual
    this.messages.push({ text: this.userInput, sender: 'user', time: currentTime }); // Agregar la hora al mensaje
    this.userInput = '';

    const response = this.responses[userMessage] || this.responses["default"];
    setTimeout(() => {
      this.messages.push({ text: response, sender: 'bot', time: this.getCurrentTime() }); // Agregar la hora al mensaje del bot
    }, 500);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
      this.selectedFileType = file.type;

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
      this.messages.push({ sender: 'user', text: `Imagen subida: ${this.selectedFile.name}`, time: this.getCurrentTime() }); // Agregar la hora al mensaje
      this.selectedFile = null;
      this.imagePreview = null;
    }
  }
  toggleVisionModel(model: string) {
    this.visionModelActive = model;
    alert('Modelo de visión activado: ${model}');
  }

}
