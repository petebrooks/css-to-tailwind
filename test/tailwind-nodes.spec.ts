import { TailwindNodes } from '../src/tailwind-nodes';

function createBaseTailwindNodes() {
  return new TailwindNodes([
    {
      selector: '.alert',
      tailwindClasses: ['mt-20', 'mb-20', 'ml-20', 'mr-20'],
      skippedDeclarations: [],
    },
    {
      selector: '.alert[data-test="hello"]',
      tailwindClasses: ['pt-4', 'font-bold', 'text-center'],
      skippedDeclarations: [],
    },
    {
      selector: '.alert > .foobar-baz:hover:focus',
      tailwindClasses: ['text-left', 'text-blue-500', 'align-middle'],
      skippedDeclarations: [],
    },
  ]);
}

describe('TailwindNodes', () => {
  describe('TailwindNodes.getNodeIndexBySelector', () => {
    test('get node index by selector', () => {
      const nodes = createBaseTailwindNodes();

      expect(nodes.getNodeIndexBySelector('.alert[data-test="hello"]')).toEqual(
        1
      );
    });
  });

  describe('TailwindNodes.getNodeBySelector', () => {
    test('get node by selector', () => {
      const nodes = createBaseTailwindNodes();

      expect(nodes.getNodeBySelector('.alert[data-test="hello"]')).toEqual({
        selector: '.alert[data-test="hello"]',
        tailwindClasses: ['pt-4', 'font-bold', 'text-center'],
        skippedDeclarations: [],
      });
    });
  });

  describe('TailwindNodes.getNodes', () => {
    test('get all nodes', () => {
      const nodes = createBaseTailwindNodes();

      expect(nodes.getNodes()).toEqual([
        {
          selector: '.alert',
          tailwindClasses: ['mt-20', 'mb-20', 'ml-20', 'mr-20'],
          skippedDeclarations: [],
        },
        {
          selector: '.alert[data-test="hello"]',
          tailwindClasses: ['pt-4', 'font-bold', 'text-center'],
          skippedDeclarations: [],
        },
        {
          selector: '.alert > .foobar-baz:hover:focus',
          tailwindClasses: ['text-left', 'text-blue-500', 'align-middle'],
          skippedDeclarations: [],
        },
      ]);
    });
  });

  describe('TailwindNodes.mergeNode', () => {
    test('merge node with complex selector', () => {
      const nodes = createBaseTailwindNodes();

      // new selector
      expect(
        nodes.mergeNode({
          selector: '.alert > .bar:hover:focus',
          tailwindClasses: ['pt-12', 'mb-20', 'bg-blue-500'],
        })
      ).toEqual({
        selector: '.alert > .bar:hover:focus',
        tailwindClasses: ['pt-12', 'mb-20', 'bg-blue-500'],
        skippedDeclarations: [],
      });

      // old selector
      expect(
        nodes.mergeNode({
          selector: '.alert > .foobar-baz:hover:focus',
          tailwindClasses: ['block', 'pt-12', 'bg-cover'],
        })
      ).toEqual({
        selector: '.alert > .foobar-baz:hover:focus',
        tailwindClasses: [
          'text-left',
          'text-blue-500',
          'align-middle',
          'block',
          'pt-12',
          'bg-cover',
        ],
        skippedDeclarations: [],
      });
    });

    test('merge node with aria-disabled attribute, pseudo-class and pseudo-element selector', () => {
      const nodes = createBaseTailwindNodes();

      expect(
        nodes.mergeNode({
          selector: '.alert[aria-disabled="true"]:hover:focus::after',
          tailwindClasses: ['pt-12', 'mb-20', 'bg-blue-500'],
        })
      ).toEqual({
        selector: '.alert',
        tailwindClasses: [
          'mt-20',
          'mb-20',
          'ml-20',
          'mr-20',
          'aria-disabled:hover:focus:after:pt-12',
          'aria-disabled:hover:focus:after:mb-20',
          'aria-disabled:hover:focus:after:bg-blue-500',
        ],
        skippedDeclarations: [],
      });

      expect(
        nodes.mergeNode({
          selector: '.alert[aria-disabled="true"]:hover:focus::after',
          tailwindClasses: ['block', 'pt-12', 'mb-20', 'bg-cover'],
        })
      ).toEqual({
        selector: '.alert',
        tailwindClasses: [
          'mt-20',
          'mb-20',
          'ml-20',
          'mr-20',
          'aria-disabled:hover:focus:after:pt-12',
          'aria-disabled:hover:focus:after:mb-20',
          'aria-disabled:hover:focus:after:bg-blue-500',
          'aria-disabled:hover:focus:after:block',
          'aria-disabled:hover:focus:after:bg-cover',
        ],
        skippedDeclarations: [],
      });
    });
  });
});
