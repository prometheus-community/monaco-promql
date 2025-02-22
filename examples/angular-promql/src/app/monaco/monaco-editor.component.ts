// The MIT License (MIT)
//
// Copyright (c) Celian Garcia and Augustin Husson @ Amadeus IT Group
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import {
  Component,
  ElementRef,
  forwardRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import { fromEvent, Subscription } from 'rxjs';
import { editor } from 'monaco-editor';
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import IStandaloneEditorConstructionOptions = editor.IStandaloneEditorConstructionOptions;
import { MonacoStoreService } from './monaco-store.service';

const OPTIONS = {
  theme: 'vs-dark',
  language: 'promql',
} as IStandaloneEditorConstructionOptions;

@Component({
  selector: 'app-monaco-editor',
  templateUrl: './monaco-editor.component.html',
  styleUrls: ['./monaco-editor.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MonacoEditorComponent),
      multi: true
    },
  ],
})
export class MonacoEditorComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @ViewChild('container', { static: true }) container!: ElementRef;

  private _value?: string;
  private _editor?: IStandaloneCodeEditor;
  private _windowResizeSubscription?: Subscription;

  private _store: MonacoStoreService = inject(MonacoStoreService);

  get monaco(): any {
    return this._store.monacoInstance;
  }

  propagateChange = (_: any): void => {};
  onTouched = (): void => {};

  writeValue(value: any): void {
    this._value = value;
    this._editor?.setValue(this._value ?? '');
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit(): void {
    this.initEditor(OPTIONS);
  }

  ngOnDestroy(): void {
    if (this._windowResizeSubscription) {
      this._windowResizeSubscription.unsubscribe();
    }
    if (this._editor) {
      this._editor.dispose();
      this._editor = undefined;
    }
  }

  private initEditor(options: IStandaloneEditorConstructionOptions): void {
    this._editor = this.monaco.editor.create(this.container.nativeElement, options);
    this._editor?.setModel(this.monaco.editor.createModel(this._value, 'promql'));
    this._editor?.onDidChangeModelContent((_: any) => {
      const value = this._editor?.getValue();
      this.propagateChange(value);
    });
    if (this._windowResizeSubscription) {
      this._windowResizeSubscription.unsubscribe();
    }
    this._windowResizeSubscription = fromEvent(window, 'resize').subscribe(() => this._editor?.layout());
  }

}
