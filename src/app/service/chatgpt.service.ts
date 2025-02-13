import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatgptService {

  private apiUrl = 'https://tu-backend.com/api/chatgpt/thread';  // URL de tu backend

  constructor(private http: HttpClient) { }

  // Llamada al backend para crear un hilo en OpenAI
  createThread(): Observable<any> {
    return this.http.post<any>(this.apiUrl, {});
  }
  // const message = await openai.beta.threads.messages.create(
  //   thread.id,
  //   {
  //     role: "user",
  //     content: "I need to solve the equation `3x + 11 = 14`. Can you help me?"
  //   }
  // );
}

