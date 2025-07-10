// Definición de bloques personalizados para Blockly STEAM v2

// Definir bloques personalizados
export const initializeBlocks = (Blockly: any) => {
  console.log('🔧 Iniciando definición de bloques...');
  
  if (!Blockly || !Blockly.Blocks) {
    console.error('❌ Blockly o Blockly.Blocks no está disponible');
    return;
  }
  
  // Bloque: Avanzar
  if (!Blockly.Blocks['move_forward']) {
    console.log('➕ Definiendo bloque move_forward');
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
    console.log('➕ Definiendo bloque turn_left');
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
    console.log('➕ Definiendo bloque turn_right');
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
  
  console.log('✅ Todos los bloques definidos correctamente');
};

// Generadores JavaScript para los bloques
export const initializeGenerators = (javascriptGenerator: any) => {
  console.log('🔧 Iniciando definición de generadores...');
  
  if (!javascriptGenerator || !javascriptGenerator.forBlock) {
    console.error('❌ javascriptGenerator no está disponible');
    return;
  }
  
  // Generador para move_forward
  console.log('➕ Definiendo generador move_forward');
  javascriptGenerator.forBlock['move_forward'] = function() {
    return 'move(1);\n';
  };

  // Generador para turn_left
  console.log('➕ Definiendo generador turn_left');
  javascriptGenerator.forBlock['turn_left'] = function() {
    return 'turnLeft();\n';
  };

  // Generador para turn_right
  console.log('➕ Definiendo generador turn_right');
  javascriptGenerator.forBlock['turn_right'] = function() {
    return 'turnRight();\n';
  };
  
  console.log('✅ Todos los generadores definidos correctamente');
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