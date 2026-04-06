/**
 * Code Editor — Staff-Level Language Server Protocol Integration.
 *
 * Staff differentiator: LSP client for code intelligence — autocompletion,
 * go-to-definition, hover tooltips, and real-time diagnostics from a
 * language server running in a Web Worker.
 */

export interface LSPRequest {
  jsonrpc: '2.0';
  id: number;
  method: string;
  params: any;
}

export interface LSPResponse {
  jsonrpc: '2.0';
  id: number;
  result?: any;
  error?: { code: number; message: string };
}

export interface Diagnostic {
  line: number;
  column: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
}

/**
 * LSP client that communicates with a language server running in a Web Worker.
 */
export class LSPClient {
  private worker: Worker | null = null;
  private requestId: number = 0;
  private pendingRequests: Map<number, { resolve: Function; reject: Function }> = new Map();
  private diagnostics: Map<string, Diagnostic[]> = new Map();
  private onDiagnosticsChange: ((uri: string, diagnostics: Diagnostic[]) => void) | null = null;

  /**
   * Initializes the LSP client with a language server worker.
   */
  initialize(workerUrl: string, rootUri: string): Promise<void> {
    this.worker = new Worker(workerUrl);

    this.worker.onmessage = (e) => {
      const message = e.data as LSPResponse | any;

      if (message.id !== undefined) {
        // Response to a request
        const pending = this.pendingRequests.get(message.id);
        if (pending) {
          this.pendingRequests.delete(message.id);
          if (message.error) pending.reject(new Error(message.error.message));
          else pending.resolve(message.result);
        }
      } else if (message.method === 'textDocument/publishDiagnostics') {
        // Diagnostic notification
        const uri = message.params.uri;
        const diagnostics = message.params.diagnostics.map((d: any) => ({
          line: d.range.start.line,
          column: d.range.start.character,
          severity: d.severity === 1 ? 'error' : d.severity === 2 ? 'warning' : 'info',
          message: d.message,
        }));
        this.diagnostics.set(uri, diagnostics);
        this.onDiagnosticsChange?.(uri, diagnostics);
      }
    };

    // Send initialize request
    return this.sendRequest('initialize', {
      processId: null,
      rootUri,
      capabilities: { textDocument: { completion: {}, hover: {} } },
    });
  }

  /**
   * Requests autocompletion at a position.
   */
  async getCompletions(uri: string, line: number, column: number): Promise<any[]> {
    const result = await this.sendRequest('textDocument/completion', {
      textDocument: { uri },
      position: { line, character: column },
    });
    return result?.items || result || [];
  }

  /**
   * Gets hover information at a position.
   */
  async getHoverInfo(uri: string, line: number, column: number): Promise<string> {
    const result = await this.sendRequest('textDocument/hover', {
      textDocument: { uri },
      position: { line, character: column },
    });
    return result?.contents?.value || result?.contents || '';
  }

  /**
   * Sets up diagnostic change listener.
   */
  onDiagnostics(callback: (uri: string, diagnostics: Diagnostic[]) => void): void {
    this.onDiagnosticsChange = callback;
  }

  /**
   * Sends an LSP request.
   */
  private sendRequest(method: string, params: any): Promise<any> {
    const id = ++this.requestId;
    const request: LSPRequest = { jsonrpc: '2.0', id, method, params };

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
      this.worker?.postMessage(request);
    });
  }

  /**
   * Disposes the client and worker.
   */
  dispose(): void {
    this.worker?.terminate();
    this.worker = null;
    this.pendingRequests.clear();
  }
}
