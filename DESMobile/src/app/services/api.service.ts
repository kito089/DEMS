import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

export class ApiService {

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {}

  async post(endpoint: string, body: any) {
    const baseUrl = await this.config.getApiUrl();
    return this.http.post(`${baseUrl}${endpoint}`, body);
  }
}