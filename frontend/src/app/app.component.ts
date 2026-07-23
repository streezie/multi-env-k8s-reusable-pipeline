import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Enterprise Dashboard';
  statusMessage = 'Connecting to backend cluster...';

  ngOnInit() {
    fetch('/api/status')
      .then(response => response.json())
      .then((data: any) => this.statusMessage = `Backend Status: ${data.status}`)
      .catch(() => this.statusMessage = 'Backend unreachable via ingress routing.');
  }
}
