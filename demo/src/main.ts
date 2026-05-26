import { version } from '../../package.json';
import '../../src/register';
import './styles.css';
import { componentDemos } from './registry';
import { renderDemoApp } from './render';

const app = document.getElementById('app');
if (app) {
  renderDemoApp(app, componentDemos, version);
}
