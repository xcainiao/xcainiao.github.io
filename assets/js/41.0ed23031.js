(window.webpackJsonp=window.webpackJsonp||[]).push([[41],{331:function(n,t,e){"use strict";e.r(t);var a=e(1),i=Object(a.a)({},function(){this.$createElement;this._self._c;return this._m(0)},[function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("div",{staticClass:"content"},[e("h2",{attrs:{id:"php-version"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#php-version","aria-hidden":"true"}},[n._v("#")]),n._v(" php version")]),n._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[n._v("/sapi/cli/php -v\nPHP 7.2.10 (cli) (built: Oct  8 2018 05:36:41) ( NTS )\nCopyright (c) 1997-2018 The PHP Group\nZend Engine v3.2.0, Copyright (c) 1998-2018 Zend Technologies\n")])])]),e("h2",{attrs:{id:"error-log"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#error-log","aria-hidden":"true"}},[n._v("#")]),n._v(" error log")]),n._v(" "),e("p",[n._v("./sapi/cli/php ../crashxxxx.php")]),n._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[n._v("Warning: imap_mail(): No message string in mail command in /home/fan/github/php-7.2.10/myselffuzz/craxxx.php on line 3\nASAN:SIGSEGV\n=================================================================\n==23766==ERROR: AddressSanitizer: SEGV on unknown address 0x000000000018 (pc 0x7fae925d9cc0 bp 0x7ffcb6b27a10 sp 0x7ffcb6b274a0 T0)\nsh: 1: -t: not found\n    #0 0x7fae925d9cbf in vfprintf (/lib/x86_64-linux-gnu/libc.so.6+0x4ecbf)\n    #1 0x7fae926a1bc8 in __fprintf_chk (/lib/x86_64-linux-gnu/libc.so.6+0x116bc8)\n    #2 0xa5aeb0 in fprintf /usr/include/x86_64-linux-gnu/bits/stdio2.h:97\n    #3 0xa5aeb0 in _php_imap_mail /home/fan/github/php-7.2.10/ext/imap/php_imap.c:4065\n    #4 0xa5b22d in zif_imap_mail /home/fan/github/php-7.2.10/ext/imap/php_imap.c:4112\n    #5 0x17da703 in ZEND_DO_ICALL_SPEC_RETVAL_UNUSED_HANDLER /home/fan/Desktop/php-7.2.10/Zend/zend_vm_execute.h:573\n    #6 0x17da703 in execute_ex /home/fan/Desktop/php-7.2.10/Zend/zend_vm_execute.h:59747\n    #7 0x181b5c3 in zend_execute /home/fan/Desktop/php-7.2.10/Zend/zend_vm_execute.h:63776\n    #8 0x1356ef2 in zend_execute_scripts /home/fan/Desktop/php-7.2.10/Zend/zend.c:1496\n    #9 0x11c0776 in php_execute_script /home/fan/Desktop/php-7.2.10/main/main.c:2590\n    #10 0x1823488 in do_cli /home/fan/Desktop/php-7.2.10/sapi/cli/php_cli.c:1011\n    #11 0x18256f4 in main /home/fan/Desktop/php-7.2.10/sapi/cli/php_cli.c:1404\n    #12 0x7fae925ab82f in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x2082f)\n    #13 0x440888 in _start (/home/fan/github/php-7.2.10/sapi/cli/php+0x440888)\n\nAddressSanitizer can not provide additional info.\nSUMMARY: AddressSanitizer: SEGV ??:0 vfprintf\n==23766==ABORTING\n")])])]),e("p",[n._v("cat crashxxxx.php")]),n._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[n._v("<?php\n\timap_mail('1', 1, NULL);\n?>\n")])])]),e("h2",{attrs:{id:"analysis"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#analysis","aria-hidden":"true"}},[n._v("#")]),n._v(" Analysis")]),n._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[n._v('if (sendmail) {\n\t\tif (rpath && rpath[0]) fprintf(sendmail, "From: %s\\n", rpath);\n\t\tfprintf(sendmail, "To: %s\\n", to);\n\t\tif (cc && cc[0]) fprintf(sendmail, "Cc: %s\\n", cc);\n\t\tif (bcc && bcc[0]) fprintf(sendmail, "Bcc: %s\\n", bcc);\n\t\tfprintf(sendmail, "Subject: %s\\n", subject);\n\t\tif (headers != NULL) {\n\t\t\tfprintf(sendmail, "%s\\n", headers);\n\t\t}\n\t\tfprintf(sendmail, "\\n%s\\n", message);\n\t\tret = pclose(sendmail);\n\t\tif (ret == -1) {\n\t\t\treturn 0;\n\t\t} else {\n\t\t\treturn 1;\n\t\t}\n\t}\n')])])]),e("h2",{attrs:{id:"report"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#report","aria-hidden":"true"}},[n._v("#")]),n._v(" report")]),n._v(" "),e("p",[n._v("https://bugs.php.net/bug.php?id=77020")])])}],!1,null,null,null);t.default=i.exports}}]);