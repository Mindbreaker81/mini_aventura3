// Definición de bloques personalizados para Blockly STEAM v2
import * as Blockly from 'blockly/core';

// Definir bloques personalizados
export const initializeBlocks = () => {
  // Bloque: Avanzar
  if (!Blockly.Blocks['move_forward']) {
    Blockly.Blocks['move_forward'] = {
      init: function() {
        this.appendDummyInput()
          .appendField('avanzar 1');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
        this.setTooltip('Mueve el robot una casilla hacia adelante');
        this.setHelpUrl('');
      }
    };
  }

  // Bloque: Girar izquierda
  if (!Blockly.Blocks['turn_left']) {
    Blockly.Blocks['turn_left'] = {
      init: function() {
        this.appendDummyInput()
          .appendField('girar izquierda');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
        this.setTooltip('Gira el robot 90° a la izquierda');
        this.setHelpUrl('');
      }
    };
  }

  // Bloque: Girar derecha
  if (!Blockly.Blocks['turn_right']) {
    Blockly.Blocks['turn_right'] = {
      init: function() {
        this.appendDummyInput()
          .appendField('girar derecha');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(200);
        this.setTooltip('Gira el robot 90° a la derecha');
        this.setHelpUrl('');
      }
    };
  }
};

// Generadores JavaScript para los bloques
export const initializeGenerators = (javascriptGenerator: any) => {
  // Generador para move_forward
  javascriptGenerator.forBlock['move_forward'] = function() {
    return 'move(1);\n';
  };

  // Generador para turn_left
  javascriptGenerator.forBlock['turn_left'] = function() {
    return 'turnLeft();\n';
  };

  // Generador para turn_right
  javascriptGenerator.forBlock['turn_right'] = function() {
    return 'turnRight();\n';
  };
};

// Configuración del toolbox
export const getToolboxConfig = () => {
  return {
    kind: 'categoryToolbox',
    contents: [
      {
        kind: 'category',
        name: 'Movimiento',
        colour: '#4CAF50',
        contents: [
          { kind: 'block', type: 'move_forward' },
          { kind: 'block', type: 'turn_left' },
          { kind: 'block', type: 'turn_right' }
        ]
      },
      {
        kind: 'category',
        name: 'Control',
        colour: '#FF9800',
        contents: [
          {
            kind: 'block',
            type: 'controls_repeat_ext',
            inputs: {
              TIMES: {
                block: {
                  type: 'math_number',
                  fields: { NUM: 3 }
                }
              }
            }
          }
        ]
      }
    ]
  };
};