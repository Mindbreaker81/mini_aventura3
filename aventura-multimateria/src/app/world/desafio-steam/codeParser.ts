// Parser seguro para código Blockly sin usar eval()

export interface Command {
  action: 'move' | 'turnLeft' | 'turnRight';
  id: string;
}

export interface ParseResult {
  commands: Command[];
  errors: string[];
  totalCommands: number;
}

// Límites de seguridad
const MAX_COMMANDS = 1000;
const MAX_LOOP_ITERATIONS = 100;

export class SafeCodeParser {
  private commandId = 0;

  /**
   * Parsea código JavaScript generado por Blockly de forma segura
   */
  parseCode(code: string): ParseResult {
    this.commandId = 0;
    const errors: string[] = [];
    const commands: Command[] = [];

    try {
      // Limpiar y dividir código en líneas
      const lines = code
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('//'));

      // Procesar cada línea
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const result = this.parseLine(line, lines, i);
        
        if (result.error) {
          errors.push(result.error);
        } else if (result.commands) {
          commands.push(...result.commands);
        }

        // Control de límites de seguridad
        if (commands.length > MAX_COMMANDS) {
          errors.push(`Demasiados comandos (máximo ${MAX_COMMANDS})`);
          break;
        }
      }

    } catch (error) {
      errors.push(`Error al procesar código: ${error}`);
    }

    return {
      commands,
      errors,
      totalCommands: commands.length
    };
  }

  /**
   * Procesa una línea individual del código
   */
  private parseLine(line: string, allLines: string[], lineIndex: number): {
    commands?: Command[];
    error?: string;
    skipLines?: number;
  } {
    // Comando simple: moveForward()
    if (line.includes('moveForward()')) {
      return {
        commands: [{ action: 'move', id: this.generateId() }]
      };
    }

    // Comando simple: turnLeft()
    if (line.includes('turnLeft()')) {
      return {
        commands: [{ action: 'turnLeft', id: this.generateId() }]
      };
    }

    // Comando simple: turnRight()
    if (line.includes('turnRight()')) {
      return {
        commands: [{ action: 'turnRight', id: this.generateId() }]
      };
    }

    // Bucle for - Patrón: for (var i = 0; i < N; i++) {
    const forMatch = line.match(/for\s*\(\s*var\s+\w+\s*=\s*0;\s*\w+\s*<\s*(\d+);\s*\w+\+\+\s*\)\s*{/);
    if (forMatch) {
      const iterations = parseInt(forMatch[1]);
      
      // Validar número de iteraciones
      if (iterations > MAX_LOOP_ITERATIONS) {
        return {
          error: `Bucle demasiado grande (máximo ${MAX_LOOP_ITERATIONS} iteraciones)`
        };
      }

      // Encontrar el cuerpo del bucle
      const loopBody = this.extractLoopBody(allLines, lineIndex);
      if (loopBody.error) {
        return { error: loopBody.error };
      }

      // Parsear y repetir comandos del cuerpo
      const bodyCommands: Command[] = [];
      for (const bodyLine of loopBody.body) {
        const bodyResult = this.parseLine(bodyLine, [], 0);
        if (bodyResult.commands) {
          bodyCommands.push(...bodyResult.commands);
        }
      }

      // Repetir comandos según iteraciones
      const repeatedCommands: Command[] = [];
      for (let i = 0; i < iterations; i++) {
        repeatedCommands.push(...bodyCommands.map(cmd => ({
          ...cmd,
          id: this.generateId()
        })));
      }

      return {
        commands: repeatedCommands,
        skipLines: loopBody.endLine - lineIndex
      };
    }

    // Línea de cierre de bucle o vacía - ignorar
    if (line === '}' || line === '') {
      return {};
    }

    // Línea no reconocida
    return {
      error: `Comando no reconocido: ${line}`
    };
  }

  /**
   * Extrae el cuerpo de un bucle for
   */
  private extractLoopBody(lines: string[], startIndex: number): {
    body: string[];
    endLine: number;
    error?: string;
  } {
    const body: string[] = [];
    let braceCount = 1; // Ya contamos la llave de apertura
    let currentIndex = startIndex + 1;

    while (currentIndex < lines.length && braceCount > 0) {
      const line = lines[currentIndex].trim();
      
      if (line.includes('{')) {
        braceCount++;
      }
      if (line.includes('}')) {
        braceCount--;
      }

      // No incluir la llave de cierre final
      if (braceCount > 0) {
        body.push(line);
      }

      currentIndex++;
    }

    if (braceCount > 0) {
      return {
        body: [],
        endLine: currentIndex,
        error: 'Bucle sin cerrar - falta llave de cierre'
      };
    }

    return {
      body: body.filter(line => line !== '' && line !== '{' && line !== '}'),
      endLine: currentIndex
    };
  }

  /**
   * Genera ID único para cada comando
   */
  private generateId(): string {
    return `cmd_${++this.commandId}`;
  }
}

// Instancia global del parser
export const codeParser = new SafeCodeParser();