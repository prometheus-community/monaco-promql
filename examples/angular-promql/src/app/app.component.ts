import { Component } from '@angular/core';
import IEditorConstructionOptions = monaco.editor.IEditorConstructionOptions;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-promql';
  editorOptions: IEditorConstructionOptions = {
    theme: 'vs-dark',
    language: 'promql'
  };
  text = '100 * (1 - avg by(instance)(irate(node_cpu{mode=\'idle\'}[5m])))\n' +
    '\n' +
    'rate(demo_api_request_duration_seconds_count{status="500",job="demo"}[5m]) * 50\n' +
    '      > on(job, instance, method, path)\n' +
    '    rate(demo_api_request_duration_seconds_count{status="200",job="demo"}[5m])\n' +
    '\n' +
    'histogram_quantile(0.9, rate(demo_api_request_duration_seconds_bucket{job="demo"}[5m])) > 0.05\n' +
    '      and\n' +
    '    rate(demo_api_request_duration_seconds_count{job="demo"}[5m]) > 1\n' +
    '\n' +
    'rate(api_http_requests_total{status=500}[5m] offset 1h)\n';
}
