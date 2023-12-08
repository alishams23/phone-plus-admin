import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { generateJSON } from '@tiptap/html';
import { fixTipTapContent } from './imgTop';

export const ImgHandle = Extension.create({
  name: 'eventHandler',

  addProseMirrorPlugins() {
    const { editor } = this;
    return [
      ...(this.parent?.() || []),
      new Plugin({
        key: new PluginKey('eventHandler'),
        props: {
          handlePaste(view, event) {
            if (!event.clipboardData) {
              return false;
            }

            const mdContents = event.clipboardData.getData('text/html');

            editor.commands.insertContent(
              generateJSON(fixTipTapContent(mdContents), editor.allExt)
            );

            return true;
          },
        },
      }),
    ];
  },
});
