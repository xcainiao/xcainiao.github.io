(window.webpackJsonp=window.webpackJsonp||[]).push([[35],{338:function(n,e,t){"use strict";t.r(e);var a=t(1),r=Object(a.a)({},function(){this.$createElement;this._self._c;return this._m(0)},[function(){var n=this,e=n.$createElement,t=n._self._c||e;return t("div",{staticClass:"content"},[t("h2",{attrs:{id:"git-log"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#git-log","aria-hidden":"true"}},[n._v("#")]),n._v(" git log")]),n._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[n._v("commit 01f3a8786127748b5bbd4614880c4484570bbd44\nAuthor: Roger Peppe <rogpeppe@gmail.com>\nDate:   Mon Jan 8 18:47:02 2018 +0000\n\n    Remove need for PTRDIFF_MAX\n\n    It's just as easy to calculate the maximum value directly.\n\n")])])]),t("h2",{attrs:{id:"compile"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#compile","aria-hidden":"true"}},[n._v("#")]),n._v(" compile")]),n._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[n._v("gcc -I./  -I./include -g  -fsanitize=address ./leak.c -o leak ./src/.libs/libyaml.so\n")])])]),t("h2",{attrs:{id:"testcode"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#testcode","aria-hidden":"true"}},[n._v("#")]),n._v(" testcode")]),n._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[n._v('#include "yaml.h"\n\n#include <stdlib.h>\n#include <stdio.h>\n#include <string.h>\n#include <stdint.h>\n\n#ifdef NDEBUG\n#undef NDEBUG\n#endif\n#include <assert.h>\n\n#define BUFFER_SIZE 65536\n#define MAX_DOCUMENTS  16\n#define MAX_EVENTS  1024\n\nstatic int canonical = 0;\nstatic int unicode = 0;\nstatic char *curpos = NULL;\nstatic size_t remainder = 0;\n\nint compare_nodes(yaml_document_t *document1, int index1,\n        yaml_document_t *document2, int index2, int level)\n{\n    if (level++ > 1000) return 0;\n    yaml_node_t *node1 = yaml_document_get_node(document1, index1);\n\n    if(!node1)\n      return 0;\n\n    yaml_node_t *node2 = yaml_document_get_node(document2, index2);\n\n    if(!node2)\n      return 0;\n\n    int k;\n\n    if (node1->type != node2->type)\n        return 0;\n\n    if (strcmp((char *)node1->tag, (char *)node2->tag) != 0) return 0;\n\n    switch (node1->type) {\n        case YAML_SCALAR_NODE:\n            if (node1->data.scalar.length != node2->data.scalar.length)\n                return 0;\n            if (strncmp((char *)node1->data.scalar.value, (char *)node2->data.scalar.value,\n                        node1->data.scalar.length) != 0) return 0;\n            break;\n        case YAML_SEQUENCE_NODE:\n            if ((node1->data.sequence.items.top - node1->data.sequence.items.start) !=\n                    (node2->data.sequence.items.top - node2->data.sequence.items.start))\n                return 0;\n            for (k = 0; k < (node1->data.sequence.items.top - node1->data.sequence.items.start); k ++) {\n                if (!compare_nodes(document1, node1->data.sequence.items.start[k],\n                            document2, node2->data.sequence.items.start[k], level)) return 0;\n            }\n            break;\n        case YAML_MAPPING_NODE:\n            if ((node1->data.mapping.pairs.top - node1->data.mapping.pairs.start) !=\n                    (node2->data.mapping.pairs.top - node2->data.mapping.pairs.start))\n                return 0;\n            for (k = 0; k < (node1->data.mapping.pairs.top - node1->data.mapping.pairs.start); k ++) {\n                if (!compare_nodes(document1, node1->data.mapping.pairs.start[k].key,\n                            document2, node2->data.mapping.pairs.start[k].key, level)) return 0;\n                if (!compare_nodes(document1, node1->data.mapping.pairs.start[k].value,\n                            document2, node2->data.mapping.pairs.start[k].value, level)) return 0;\n            }\n            break;\n        default:\n            return 0;\n    }\n    return 1;\n}\n\n\n\nint compare_documents(yaml_document_t *document1, yaml_document_t *document2)\n{\n    int k;\n\n    if ((document1->version_directive && !document2->version_directive)\n            || (!document1->version_directive && document2->version_directive)\n            || (document1->version_directive && document2->version_directive\n                && (document1->version_directive->major != document2->version_directive->major\n                    || document1->version_directive->minor != document2->version_directive->minor)))\n        return 0;\n\n    if ((document1->tag_directives.end - document1->tag_directives.start) !=\n            (document2->tag_directives.end - document2->tag_directives.start))\n        return 0;\n    for (k = 0; k < (document1->tag_directives.end - document1->tag_directives.start); k ++) {\n        if ((strcmp((char *)document1->tag_directives.start[k].handle,\n                        (char *)document2->tag_directives.start[k].handle) != 0)\n                || (strcmp((char *)document1->tag_directives.start[k].prefix,\n                    (char *)document2->tag_directives.start[k].prefix) != 0))\n            return 0;\n    }\n\n    if ((document1->nodes.top - document1->nodes.start) !=\n            (document2->nodes.top - document2->nodes.start))\n        return 0;\n\n    if (document1->nodes.top != document1->nodes.start) {\n        if (!compare_nodes(document1, 1, document2, 1, 0))\n            return 0;\n    }\n\n    return 1;\n}\n\n\nint copy_document(yaml_document_t *document_to, yaml_document_t *document_from)\n{\n    yaml_node_t *node;\n    yaml_node_item_t *item;\n    yaml_node_pair_t *pair;\n\n    if (!yaml_document_initialize(document_to, document_from->version_directive,\n                document_from->tag_directives.start,\n                document_from->tag_directives.end,\n                document_from->start_implicit, document_from->end_implicit))\n        return 0;\n\n    for (node = document_from->nodes.start;\n            node < document_from->nodes.top; node ++) {\n        switch (node->type) {\n            case YAML_SCALAR_NODE:\n                if (!yaml_document_add_scalar(document_to, node->tag,\n                            node->data.scalar.value, node->data.scalar.length,\n                            node->data.scalar.style)) goto error;\n                break;\n            case YAML_SEQUENCE_NODE:\n                if (!yaml_document_add_sequence(document_to, node->tag,\n                            node->data.sequence.style)) goto error;\n                break;\n            case YAML_MAPPING_NODE:\n                if (!yaml_document_add_mapping(document_to, node->tag,\n                            node->data.mapping.style)) goto error;\n                break;\n            default:\n                goto error;\n        }\n    }\n    for (node = document_from->nodes.start;\n            node < document_from->nodes.top; node ++) {\n        switch (node->type) {\n            case YAML_SEQUENCE_NODE:\n                for (item = node->data.sequence.items.start;\n                        item < node->data.sequence.items.top; item ++) {\n                    if (!yaml_document_append_sequence_item(document_to,\n                                node - document_from->nodes.start + 1,\n                                *item)) goto error;\n                }\n                break;\n            case YAML_MAPPING_NODE:\n                for (pair = node->data.mapping.pairs.start;\n                        pair < node->data.mapping.pairs.top; pair ++) {\n                    if (!yaml_document_append_mapping_pair(document_to,\n                                node - document_from->nodes.start + 1,\n                                pair->key, pair->value)) goto error;\n                }\n                break;\n            default:\n                break;\n        }\n    }\n    return 1;\n\nerror:\n    yaml_document_delete(document_to);\n    return 0;\n}\n\n\nint\ndumper_main(void)\n{\n        yaml_parser_t parser;\n        yaml_emitter_t emitter;\n\n        yaml_document_t document;\n        unsigned char buffer[BUFFER_SIZE+1];\n        size_t written = 0;\n        yaml_document_t documents[MAX_DOCUMENTS];\n        size_t document_number = 0;\n        int done = 0;\n        int count = 0;\n        int error = 0;\n        int k;\n        memset(buffer, 0, BUFFER_SIZE+1);\n        memset(documents, 0, MAX_DOCUMENTS*sizeof(yaml_document_t));\n\n        if(!yaml_parser_initialize(&parser))\n          return 0;\n\n        yaml_parser_set_input_string(&parser, curpos, remainder);\n        if(!yaml_emitter_initialize(&emitter))\n          return 0;\n\n        if (canonical) {\n            yaml_emitter_set_canonical(&emitter, 1);\n        }\n        if (unicode) {\n            yaml_emitter_set_unicode(&emitter, 1);\n        }\n        yaml_emitter_set_output_string(&emitter, buffer, BUFFER_SIZE, &written);\n        yaml_emitter_open(&emitter);\n\n        while (!done)\n        {\n            if (!yaml_parser_load(&parser, &document)) {\n                error = 1;\n                break;\n            }\n\n            done = (!yaml_document_get_root_node(&document));\n            if (!done) {\n                if(document_number >= MAX_DOCUMENTS) {\n                  yaml_document_delete(&document);\n                  error = 1;\n                  break;\n                }\n\n                if(!copy_document(&(documents[document_number++]), &document)) {\n                  yaml_document_delete(&document);\n                  error = 1;\n                  break;\n                }\n                if(!(yaml_emitter_dump(&emitter, &document) || (yaml_emitter_flush(&emitter) && 0))) {\n                  error = 1;\n                  break;\n                }\n\n                count ++;\n            }\n            else {\n                yaml_document_delete(&document);\n            }\n        }\n\n        yaml_parser_delete(&parser);\n        yaml_emitter_close(&emitter);\n        yaml_emitter_delete(&emitter);\n\n        if (!error)\n        {\n            count = done = 0;\n            if(!yaml_parser_initialize(&parser))\n              return 0;\n\n            yaml_parser_set_input_string(&parser, buffer, written);\n\n            while (!done)\n            {\n                if(!(yaml_parser_load(&parser, &document) || 0)) {\n                  yaml_parser_delete(&parser);\n                  return 0;\n                }\n\n                done = (!yaml_document_get_root_node(&document));\n                if (!done) {\n                    if(!(compare_documents(documents+count, &document) || 0)) {\n                      yaml_parser_delete(&parser);\n                      return 0;\n                    }\n                    count ++;\n                }\n                yaml_document_delete(&document);\n            }\n            yaml_parser_delete(&parser);\n        }\n\n        for (k = 0; k < document_number; k ++) {\n            yaml_document_delete(documents+k);\n        }\n\n        printf("PASSED (length: %d)\\n", written);\n\n    return 0;\n}\n\n\nint main()\n{\n  int size = 20;\n  char *data = "\\xfe\\x03\\x0d\\x21\\x0d\\x0d\\x0d\\x0d\\x2d\\x2d\\x2d\\x0d\\x3b\\x47\\x0d\\x0d\\x51\\x51\\x2d\\x31";\n  canonical = data[0] & 1;\n  unicode = data[1] & 1;\n  curpos = data + 3;\n  remainder = size - 3;\n\n  dumper_main();\n  return 0;\n}\n')])])]),t("h2",{attrs:{id:"error"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#error","aria-hidden":"true"}},[n._v("#")]),n._v(" error")]),n._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[n._v("=================================================================\n==10850==ERROR: LeakSanitizer: detected memory leaks\n\nDirect leak of 3072 byte(s) in 2 object(s) allocated from:\n    #0 0x7f7e287af602 in malloc (/usr/lib/x86_64-linux-gnu/libasan.so.2+0x98602)\n    #1 0x7f7e2849314c in yaml_malloc /home/fuzz/github/libyaml_g/src/api.c:33\n    #2 0x7f7e2849b639 in yaml_document_initialize /home/fuzz/github/libyaml_g/src/api.c:1059\n    #3 0x40226e in copy_document leak_1.c:119\n    #4 0x402b25 in dumper_main leak_1.c:225\n    #5 0x402ecf in main leak_1.c:293\n    #6 0x7f7e280e282f in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x2082f)\n\nDirect leak of 1536 byte(s) in 1 object(s) allocated from:\n    #0 0x7f7e287af602 in malloc (/usr/lib/x86_64-linux-gnu/libasan.so.2+0x98602)\n    #1 0x7f7e2849314c in yaml_malloc /home/fuzz/github/libyaml_g/src/api.c:33\n    #2 0x7f7e284e2036 in yaml_parser_load /home/fuzz/github/libyaml_g/src/loader.c:75\n    #3 0x402c4c in dumper_main leak_1.c:256\n    #4 0x402ecf in main leak_1.c:293\n    #5 0x7f7e280e282f in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x2082f)\n\nIndirect leak of 44 byte(s) in 2 object(s) allocated from:\n    #0 0x7f7e2877930f in strdup (/usr/lib/x86_64-linux-gnu/libasan.so.2+0x6230f)\n    #1 0x7f7e284931ec in yaml_strdup /home/fuzz/github/libyaml_g/src/api.c:66\n    #2 0x7f7e2849c939 in yaml_document_add_scalar /home/fuzz/github/libyaml_g/src/api.c:1215\n    #3 0x4023d4 in copy_document leak_1.c:129\n    #4 0x402b25 in dumper_main leak_1.c:225\n    #5 0x402ecf in main leak_1.c:293\n    #6 0x7f7e280e282f in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x2082f)\n\nIndirect leak of 22 byte(s) in 1 object(s) allocated from:\n    #0 0x7f7e2877930f in strdup (/usr/lib/x86_64-linux-gnu/libasan.so.2+0x6230f)\n    #1 0x7f7e284931ec in yaml_strdup /home/fuzz/github/libyaml_g/src/api.c:66\n    #2 0x7f7e284e3964 in yaml_parser_load_scalar /home/fuzz/github/libyaml_g/src/loader.c:293\n    #3 0x7f7e284e3083 in yaml_parser_load_node /home/fuzz/github/libyaml_g/src/loader.c:207\n    #4 0x7f7e284e2e05 in yaml_parser_load_document /home/fuzz/github/libyaml_g/src/loader.c:184\n    #5 0x7f7e284e2414 in yaml_parser_load /home/fuzz/github/libyaml_g/src/loader.c:98\n    #6 0x402c4c in dumper_main leak_1.c:256\n    #7 0x402ecf in main leak_1.c:293\n    #8 0x7f7e280e282f in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x2082f)\n\nIndirect leak of 16 byte(s) in 1 object(s) allocated from:\n    #0 0x7f7e287af602 in malloc (/usr/lib/x86_64-linux-gnu/libasan.so.2+0x98602)\n    #1 0x7f7e2849314c in yaml_malloc /home/fuzz/github/libyaml_g/src/api.c:33\n    #2 0x7f7e284c4779 in yaml_parser_scan_flow_scalar /home/fuzz/github/libyaml_g/src/scanner.c:3027\n    #3 0x7f7e284acae4 in yaml_parser_fetch_flow_scalar /home/fuzz/github/libyaml_g/src/scanner.c:1872\n    #4 0x7f7e284a343a in yaml_parser_fetch_next_token /home/fuzz/github/libyaml_g/src/scanner.c:999\n    #5 0x7f7e284a107f in yaml_parser_fetch_more_tokens /home/fuzz/github/libyaml_g/src/scanner.c:846\n    #6 0x7f7e284d5b20 in yaml_parser_parse_document_content /home/fuzz/github/libyaml_g/src/parser.c:444\n    #7 0x7f7e284d3c27 in yaml_parser_state_machine /home/fuzz/github/libyaml_g/src/parser.c:240\n    #8 0x7f7e284d3882 in yaml_parser_parse /home/fuzz/github/libyaml_g/src/parser.c:188\n    #9 0x7f7e284e2dde in yaml_parser_load_document /home/fuzz/github/libyaml_g/src/loader.c:182\n    #10 0x7f7e284e2414 in yaml_parser_load /home/fuzz/github/libyaml_g/src/loader.c:98\n    #11 0x402c4c in dumper_main leak_1.c:256\n    #12 0x402ecf in main leak_1.c:293\n    #13 0x7f7e280e282f in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x2082f)\n\nIndirect leak of 9 byte(s) in 2 object(s) allocated from:\n    #0 0x7f7e287af602 in malloc (/usr/lib/x86_64-linux-gnu/libasan.so.2+0x98602)\n    #1 0x7f7e2849314c in yaml_malloc /home/fuzz/github/libyaml_g/src/api.c:33\n    #2 0x7f7e2849c9a2 in yaml_document_add_scalar /home/fuzz/github/libyaml_g/src/api.c:1223\n    #3 0x4023d4 in copy_document leak_1.c:129\n    #4 0x402b25 in dumper_main leak_1.c:225\n    #5 0x402ecf in main leak_1.c:293\n    #6 0x7f7e280e282f in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x2082f)\n\nSUMMARY: AddressSanitizer: 4699 byte(s) leaked in 9 allocation(s).\n")])])])])}],!1,null,null,null);e.default=r.exports}}]);