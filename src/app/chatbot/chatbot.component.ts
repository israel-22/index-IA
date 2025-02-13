// chatbot.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { apiService } from '../service/api.service';  // Importando el servicio

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, MatIconModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  userInput: string = '';
  messages: { text: string; sender: 'user' | 'bot'; time?: string }[] = [];
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  selectedFileName: string = '';
  selectedFileType: string = '';
  private visionModelActive: string | null = null;

  private isRecording: boolean = false;
  private recognition: any;
  private isRecognizing: boolean = false;

  constructor(private apiService: apiService) {}

  ngOnInit() {
    this.initializeRecognition();
  }

  getCurrentTime(): string {
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
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

  // Método actualizado para enviar el mensaje usando postData
  sendMessage() {
    if (this.userInput.trim() === '') return;

    const userMessage = this.userInput;
    this.messages.push({ text: userMessage, sender: 'user', time: this.getCurrentTime() });
    this.userInput = '';

    // Llamamos a la API utilizando postData y enviamos el mensaje del usuario
    this.apiService.postData({ message: userMessage }).subscribe(
      (response: any) => {
        // Suponemos que la respuesta tiene una propiedad 'reply' con la respuesta del bot
        this.messages.push({ text: response.reply, sender: 'bot', time: this.getCurrentTime() });
      },
      (error: any) => {
        console.error('Error al obtener respuesta del bot:', error);
        this.messages.push({ text: 'Lo siento, algo salió mal. Intenta nuevamente.', sender: 'bot', time: this.getCurrentTime() });
      }
    );
  }

  // Método para manejar la carga de archivos de imagen
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
      this.messages.push({ sender: 'user', text: `Imagen subida: ${this.selectedFile.name}`, time: this.getCurrentTime() });
      this.selectedFile = null;
      this.imagePreview = null;
    }
  }

  toggleVisionModel(model: string) {
    this.visionModelActive = model;
    alert(`Modelo de visión activado: ${model}`);
  }
}
