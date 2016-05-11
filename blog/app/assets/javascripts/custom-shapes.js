/***********************************************************************************************
This is required for creating Diamond shapes in the program.  Since Diamonds do not come
in JointJS library, we had to manually create it.
***********************************************************************************************/
joint.shapes.basic.Diamond = joint.shapes.basic.Generic.extend({

    markup: '<g class="rotatable"><g class="scalable"><path/></g><text/></g>',

    defaults: joint.util.deepSupplement({

        type: 'basic.Diamond',
        attrs: {
              'path': { d: 'M 30 0 L 60 30 30 60 0 30 z' },
              'text': {           ref: 'path', 
                        'y-alignment': 'middle', 
                                 fill: 'black', 
                        'font-family': 'Arial, helvetica, sans-serif',
                              'ref-x': .5,
                              'ref-y': .5,
                              'text-anchor': 'middle'
                      }
        }

    }, joint.shapes.basic.Generic.prototype.defaults)
});
