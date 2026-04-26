class RandomTools {
  getInfo() {
    return {
      id: 'randomtools',
      name: '高级随机 & 跨角色控制',
      color1: '#2196F3',
      color2: '#1976D2',

      menus: {
        spriteMenu: '_getSpriteList'
      },

      blocks: [
        {
          opcode: 'random01',
          blockType: 'reporter',
          text: '0 到 1 随机小数'
        },
        '---',
        {
          opcode: 'randomAB',
          blockType: 'reporter',
          text: '[A] 到 [B] 随机小数',
          arguments: {
            A: { type: 'number', defaultValue: 0 },
            B: { type: 'number', defaultValue: 10 }
          }
        },
        '---',
        {
          opcode: 'randomBool',
          blockType: 'Boolean',
          text: '随机真假 概率 [P]%',
          arguments: {
            P: { type: 'number', defaultValue: 50 }
          }
        },
        '---',
        {
          opcode: 'randomAngle',
          blockType: 'reporter',
          text: '随机角度 0~360'
        },
        '---',
        {
          opcode: 'randomStageX',
          blockType: 'reporter',
          text: '随机舞台 X 坐标'
        },
        {
          opcode: 'randomStageY',
          blockType: 'reporter',
          text: '随机舞台 Y 坐标'
        },
        '---',
        {
          opcode: 'randomChar',
          blockType: 'reporter',
          text: '从文本 [TEXT] 随机选 [NUM] 个字符 允许重复 [REPEAT]',
          arguments: {
            TEXT: { type: 'string', defaultValue: 'turbowarp' },
            NUM: { type: 'number', defaultValue: 1 },
            REPEAT: { type: 'number', defaultValue: false }
          }
        },
        '---',
        {
          opcode: 'getTargetX',
          blockType: 'reporter',
          text: '角色 [SPRITE] 的 X 坐标',
          arguments: {
            SPRITE: { type: 'string', menu: 'spriteMenu', defaultValue: '' }
          }
        },
        {
          opcode: 'getTargetY',
          blockType: 'reporter',
          text: '角色 [SPRITE] 的 Y 坐标',
          arguments: {
            SPRITE: { type: 'string', menu: 'spriteMenu', defaultValue: '' }
          }
        },
        {
          opcode: 'getTargetDir',
          blockType: 'reporter',
          text: '角色 [SPRITE] 的方向',
          arguments: {
            SPRITE: { type: 'string', menu: 'spriteMenu', defaultValue: '' }
          }
        },
        {
          opcode: 'getTargetVisible',
          blockType: 'Boolean',
          text: '角色 [SPRITE] 是否显示',
          arguments: {
            SPRITE: { type: 'string', menu: 'spriteMenu', defaultValue: '' }
          }
        },
        '---',
        {
          opcode: 'setTargetPos',
          blockType: 'command',
          text: '设置角色 [SPRITE] 坐标 x:[x] y:[y]',
          arguments: {
            SPRITE: { type: 'string', menu: 'spriteMenu', defaultValue: '' },
            x: { type: 'number', defaultValue: 0 },
            y: { type: 'number', defaultValue: 0 }
          }
        },
        {
          opcode: 'setTargetDir',
          blockType: 'command',
          text: '设置角色 [SPRITE] 方向为 [dir]',
          arguments: {
            SPRITE: { type: 'string', menu: 'spriteMenu', defaultValue: '' },
            dir: { type: 'number', defaultValue: 90 }
          }
        },
        {
          opcode: 'showTarget',
          blockType: 'command',
          text: '显示角色 [SPRITE]',
          arguments: {
            SPRITE: { type: 'string', menu: 'spriteMenu', defaultValue: '' }
          }
        },
        {
          opcode: 'hideTarget',
          blockType: 'command',
          text: '隐藏角色 [SPRITE]',
          arguments: {
            SPRITE: { type: 'string', menu: 'spriteMenu', defaultValue: '' }
          }
        }
      ]
    };
  }

  _getSpriteList() {
    const list = [];
    const currentName = vm.editingTarget?.getName() || '';
    vm.runtime.targets.forEach(t => {
      if (t.sprite) {
        list.push({
          text: t.getName(),
          value: t.getName(),
          selected: t.getName() === currentName
        });
      }
    });
    return list;
  }

  random01() {
    return Math.random();
  }

  randomAB(args) {
    const min = Math.min(args.A, args.B);
    const max = Math.max(args.A, args.B);
    return min + Math.random() * (max - min);
  }

  randomBool(args) {
    return Math.random() < args.P / 100;
  }

  randomAngle() {
    return Math.random() * 360;
  }

  randomStageX() {
    const w = vm.runtime.stageWidth;
    return -w / 2 + Math.random() * w;
  }

  randomStageY() {
    const h = vm.runtime.stageHeight;
    return -h / 2 + Math.random() * h;
  }

  randomChar(args) {
    const str = args.TEXT;
    const count = Math.max(1, Math.floor(args.NUM));
    const repeat = !!args.REPEAT;
    const chars = str.split('');
    if (chars.length === 0) return '';
    let res = [];
    if (repeat) {
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * chars.length);
        res.push(chars[idx]);
      }
    } else {
      let pool = [...chars];
      for (let i = 0; i < count && pool.length > 0; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        res.push(pool.splice(idx, 1)[0]);
      }
    }
    return res.join('');
  }

  _getTarget(name) {
    if (!name) name = vm.editingTarget?.getName();
    const targets = vm.runtime.targets;
    for (const t of targets) {
      if (t.sprite && t.getName() === name) return t;
    }
    return null;
  }

  getTargetX(args) {
    const t = this._getTarget(args.SPRITE);
    return t ? t.x : 0;
  }

  getTargetY(args) {
    const t = this._getTarget(args.SPRITE);
    return t ? t.y : 0;
  }

  getTargetDir(args) {
    const t = this._getTarget(args.SPRITE);
    return t ? t.direction : 90;
  }

  getTargetVisible(args) {
    const t = this._getTarget(args.SPRITE);
    return t ? t.visible : false;
  }

  setTargetPos(args) {
    const t = this._getTarget(args.SPRITE);
    if (t) t.setXY(args.x, args.y);
  }

  setTargetDir(args) {
    const t = this._getTarget(args.SPRITE);
    if (t) t.setDirection(args.dir);
  }

  showTarget(args) {
    const t = this._getTarget(args.SPRITE);
    if (t) t.setVisible(true);
  }

  hideTarget(args) {
    const t = this._getTarget(args.SPRITE);
    if (t) t.setVisible(false);
  }
}

Scratch.extensions.register(new RandomTools());
