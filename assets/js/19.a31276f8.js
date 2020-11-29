(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{300:function(e,t,n){e.exports=n.p+"assets/img/libzmq-gdb.1cdc43f5.png"},337:function(e,t,n){"use strict";n.r(t);var f=[function(){var e=this,t=e.$createElement,f=e._self._c||t;return f("div",{staticClass:"content"},[f("h2",{attrs:{id:"_0x1-编译"}},[f("a",{staticClass:"header-anchor",attrs:{href:"#_0x1-编译","aria-hidden":"true"}},[e._v("#")]),e._v(" 0x1 编译")]),e._v(" "),f("p",[e._v("漏洞作者在github给出了self-exploit，首先编译这个exploit。")]),e._v(" "),f("ul",[f("li",[e._v("exp地址：https://github.com/zeromq/libzmq/issues/3351*")])]),e._v(" "),f("p",[e._v("直接在github clone libzmq源码，回滚到存在漏洞的版本。")]),e._v(" "),f("ul",[f("li",[e._v("git clone https://github.com/zeromq/libzmq.git")])]),e._v(" "),f("p",[e._v("在zeromq主页中找到cppzmq，直接git clone。")]),e._v(" "),f("ul",[f("li",[e._v("cppzmq is a C++ binding for libzmq")]),e._v(" "),f("li",[e._v("git clone https://github.com/zeromq/cppzmq")])]),e._v(" "),f("p",[e._v("按照cppzmq的安装方式编译安装libzmq和cppzmq。安装完成之后编译作者给出的self-exploit。")]),e._v(" "),f("h2",{attrs:{id:"_0x2-漏洞分析"}},[f("a",{staticClass:"header-anchor",attrs:{href:"#_0x2-漏洞分析","aria-hidden":"true"}},[e._v("#")]),e._v(" 0x2 漏洞分析")]),e._v(" "),f("p",[e._v("漏洞发生在v2_decoder.cpp:117行size_ready函数，当 msg_size 特别大的时候，read_pos_ + msg_size 发生溢出，跳过程序原有的判断。")]),e._v(" "),f("div",{staticClass:"language- extra-class"},[f("pre",{pre:!0,attrs:{class:"language-text"}},[f("code",[e._v("if (unlikely (!_zero_copy\n                  || ((unsigned char *) read_pos_ + msg_size_\n                      > (allocator.data () + allocator.size ())))){\n                      \n\t\t\t\t\t\t...\n\t\t\t\t\t\t...\n\t\t\t\t\t\t...\n                      \n } else{\n \t\t\t\t\t\t...\n \t\t\t\t\t\t...\n \t\t\t\t\t\t...\n }\n")])])]),f("p",[e._v("msg_size 是数据包中发送数据的长度。")]),e._v(" "),f("p",[e._v("在函数in_event中，利用tcp_read读取数据，随后用decode解析数据。")]),e._v(" "),f("div",{staticClass:"language- extra-class"},[f("pre",{pre:!0,attrs:{class:"language-text"}},[f("code",[e._v(".....\n\nconst int rc = tcp_read (_s, _inpos, bufsize);\n\n.....\n\n_decoder->decode (_inpos, _insize, processed);\n\n.....\n")])])]),f("p",[e._v("根据输入的第1个字节，判断接下来调用哪个函数。这里选择eight_byte_size_ready。")]),e._v(" "),f("div",{staticClass:"language- extra-class"},[f("pre",{pre:!0,attrs:{class:"language-text"}},[f("code",[e._v("int zmq::v2_decoder_t::flags_ready (unsigned char const *)\n{\n    _msg_flags = 0;\n    if (_tmpbuf[0] & v2_protocol_t::more_flag)\n        _msg_flags |= msg_t::more;\n    if (_tmpbuf[0] & v2_protocol_t::command_flag)\n        _msg_flags |= msg_t::command;\n\n    //  The payload length is either one or eight bytes,\n    //  depending on whether the 'large' bit is set.\n    if (_tmpbuf[0] & v2_protocol_t::large_flag)\n        next_step (_tmpbuf, 8, &v2_decoder_t::eight_byte_size_ready);\n    else\n        next_step (_tmpbuf, 1, &v2_decoder_t::one_byte_size_ready);\n\n    return 0;\n}\n")])])]),f("p",[e._v("在eight_byte_size_ready函数中，利用get_uint64将接下来的8字节转换成int，就是传入消息的长度。最后调用size_ready函数触发溢出。")]),e._v(" "),f("div",{staticClass:"language- extra-class"},[f("pre",{pre:!0,attrs:{class:"language-text"}},[f("code",[e._v("\nint zmq::v2_decoder_t::eight_byte_size_ready (unsigned char const *read_from_)\n{\n    //  The payload size is encoded as 64-bit unsigned integer.\n    //  The most significant byte comes first.\n    const uint64_t msg_size = get_uint64 (_tmpbuf);\n\n    return size_ready (msg_size, read_from_);\n}\n")])])]),f("h2",{attrs:{id:"_0x3-漏洞利用"}},[f("a",{staticClass:"header-anchor",attrs:{href:"#_0x3-漏洞利用","aria-hidden":"true"}},[e._v("#")]),e._v(" 0x3 漏洞利用")]),e._v(" "),f("p",[e._v("size_ready 函数中。当接收数据的长度大于之前分配的内存的时候，程序重新分配内存。但是之前的判断可控，当msg_size_特别大的时候不去重新分配内存。这样在下一次tcp_read接收数据时发生溢出。")]),e._v(" "),f("div",{staticClass:"language- extra-class"},[f("pre",{pre:!0,attrs:{class:"language-text"}},[f("code",[e._v("if (unlikely (!_zero_copy\n                  || ((unsigned char *) read_pos_ + msg_size_\n                      > (allocator.data () + allocator.size ())))) {\n        // a new message has started, but the size would exceed the pre-allocated arena\n        // this happens every time when a message does not fit completely into the buffer\n        rc = _in_progress.init_size (static_cast<size_t> (msg_size_));\n    } else {\n        // construct message using n bytes from the buffer as storage\n        // increase buffer ref count\n        // if the message will be a large message, pass a valid refcnt memory location as well\n        rc =\n          _in_progress.init (const_cast<unsigned char *> (read_pos_),\n                             static_cast<size_t> (msg_size_),\n                             shared_message_memory_allocator::call_dec_ref,\n                             allocator.buffer (), allocator.provide_content ());\n\n        // For small messages, data has been copied and refcount does not have to be increased\n        if (_in_progress.is_zcmsg ()) {\n            allocator.advance_content ();\n            allocator.inc_ref ();\n        }\n    }\n")])])]),f("p",[e._v("data内存布局：")]),e._v(" "),f("p",[e._v("size_ready函数调用_i_progress.init后，最终调用init_external_storage函数。")]),e._v(" "),f("p",[e._v("data + the struct content_t 是一个单链表，在init_external_storage函数中将data_地址、size_、函数指针ffn_ 和hint_放到data 后边。这样当再一次接受数据时可以覆盖后边的函数指针和他的参数。")]),e._v(" "),f("ul",[f("li",[e._v("ffn_是一个函数指针，当连接关闭的时候调用。")])]),e._v(" "),f("div",{staticClass:"language- extra-class"},[f("pre",{pre:!0,attrs:{class:"language-text"}},[f("code",[e._v("struct content_t\n    {\n        void *data;\n        size_t size;\n        msg_free_fn *ffn;\n        void *hint;\n        zmq::atomic_counter_t refcnt;\n    };\n\nint zmq::msg_t::init_external_storage\n{\n    zmq_assert (NULL != data_);\n    zmq_assert (NULL != content_);\n\n    _u.zclmsg.metadata = NULL;\n    _u.zclmsg.type = type_zclmsg;\n    _u.zclmsg.flags = 0;\n    _u.zclmsg.group[0] = '\\0';\n    _u.zclmsg.routing_id = 0;\n\n    _u.zclmsg.content = content_;\n    _u.zclmsg.content->data = data_;\n    _u.zclmsg.content->size = size_;\n    _u.zclmsg.content->ffn = ffn_;\n    _u.zclmsg.content->hint = hint_;\n    new (&_u.zclmsg.content->refcnt) zmq::atomic_counter_t ();\n\n    return 0;\n}\n")])])]),f("p",[f("img",{attrs:{src:n(300),alt:"avatar"}})]),e._v(" "),f("p",[e._v("在作者的self-exploit中，一个线程调用zmp，一个线程发送数据。这样就可以确定strcpy、system的地址，不需要考虑aslr。")]),e._v(" "),f("p",[e._v("call strcpy")]),e._v(" "),f("div",{staticClass:"language- extra-class"},[f("pre",{pre:!0,attrs:{class:"language-text"}},[f("code",[e._v('$rax   : 0x00007f82559f7540  →  <__strcpy_sse2_unaligned+0> mov rcx, rsi\n$rbx   : 0x0               \n$rcx   : 0x0000555a71846020  →  0x0000696d616f6877 ("whoami"?)\n$rdx   : 0x0000555a718460c0  →  0x0000000000000000\n$rsp   : 0x00007f824fffdff0  →  0x0000000000000000\n$rbp   : 0x00007f824fffe010  →  0x00007f824fffe040  →  0x00007f824fffe060  →  0x00007f824fffe0b0  →  0x00007f824fffe0d0  →  0x00007f824fffe150  →  0x00007f824fffe1a0  →  0x00007f824fffee00\n$rsi   : 0x0000555a71846020  →  0x0000696d616f6877 ("whoami"?)\n$rdi   : 0x0000555a718460c0  →  0x0000000000000000\n$rip   : 0x00007f82565de009  →  <zmq::msg_t::close()+441> call rax\n$r8    : 0x0               \n$r9    : 0x0               \n$r10   : 0x9               \n$r11   : 0x00007f825662174a  →  <zmq::v2_decoder_t::~v2_decoder_t()+0> push rbp\n$r12   : 0x00007f824fffefc0  →  0x0000000000000000\n$r13   : 0x0               \n$r14   : 0x00007f8250004f98  →  0x00007f82565efa6a  →  <zmq::worker_poller_base_t::worker_routine(void*)+0> push rbp\n$r15   : 0x00007f8255399910  →  0x00007f8255399950  →  0x00007f82553999a0  →  0x00007f8255399a40  →  0x0000000100000009\n$eflags: [zero carry parity adjust sign trap INTERRUPT direction overflow resume virtualx86 identification]\n$cs: 0x0033 $ss: 0x002b $ds: 0x0000 $es: 0x0000 $fs: 0x0000 $gs: 0x0000 \n──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── stack ────\n0x00007f824fffdff0│+0x0000: 0x0000000000000000\t ← $rsp\n0x00007f824fffdff8│+0x0008: 0x00007f824800ba98  →  0x0000000000000000\n0x00007f824fffe000│+0x0010: 0x00007f824fffe020  →  0x00007f824fffe060  →  0x00007f824fffe0b0  →  0x00007f824fffe0d0  →  0x00007f824fffe150  →  0x00007f824fffe1a0  →  0x00007f824fffee00\n0x00007f824fffe008│+0x0018: 0x0000000000000000\n0x00007f824fffe010│+0x0020: 0x00007f824fffe040  →  0x00007f824fffe060  →  0x00007f824fffe0b0  →  0x00007f824fffe0d0  →  0x00007f824fffe150  →  0x00007f824fffe1a0  →  0x00007f824fffee00\t ← $rbp\n0x00007f824fffe018│+0x0028: 0x00007f8256621778  →  <zmq::v2_decoder_t::~v2_decoder_t()+46> mov DWORD PTR [rbp-0xc], eax\n0x00007f824fffe020│+0x0030: 0x00007f824fffe060  →  0x00007f824fffe0b0  →  0x00007f824fffe0d0  →  0x00007f824fffe150  →  0x00007f824fffe1a0  →  0x00007f824fffee00  →  0x00007f824fffee20\n0x00007f824fffe028│+0x0038: 0x00007f824800ba30  →  0x00007f825687a230  →  0x00007f825662174a  →  <zmq::v2_decoder_t::~v2_decoder_t()+0> push rbp\n────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── code:x86:64 ────\n   0x7f82565de000 <zmq::msg_t::close()+432> mov    rdx, QWORD PTR [rdx]\n   0x7f82565de003 <zmq::msg_t::close()+435> mov    rsi, rcx\n   0x7f82565de006 <zmq::msg_t::close()+438> mov    rdi, rdx\n → 0x7f82565de009 <zmq::msg_t::close()+441> call   rax\n   0x7f82565de00b <zmq::msg_t::close()+443> mov    rax, QWORD PTR [rbp-0x18]\n   0x7f82565de00f <zmq::msg_t::close()+447> mov    rax, QWORD PTR [rax]\n   0x7f82565de012 <zmq::msg_t::close()+450> test   rax, rax\n   0x7f82565de015 <zmq::msg_t::close()+453> je     0x7f82565de05c <zmq::msg_t::close()+524>\n   0x7f82565de017 <zmq::msg_t::close()+455> mov    rax, QWORD PTR [rbp-0x18]\n────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── arguments (guessed) ────\n*0x7f82559f7540 (\n   $rdi = 0x0000555a718460c0 → 0x0000000000000000,\n   $rsi = 0x0000555a71846020 → 0x0000696d616f6877 ("whoami"?),\n   $rdx = 0x0000555a718460c0 → 0x0000000000000000,\n   $rcx = 0x0000555a71846020 → 0x0000696d616f6877 ("whoami"?)\n)\n─────────────────────────────────────────────────────────────────────────────────────────────────── source:/home/fan/github/libzmq/src/msg.cpp+250 ────\n    245\t             || !_u.zclmsg.content->refcnt.sub (1)) {\n    246\t             //  We used "placement new" operator to initialize the reference\n    247\t             //  counter so we call the destructor explicitly now.\n    248\t             _u.zclmsg.content->refcnt.~atomic_counter_t ();\n    249\t \n →  250\t             _u.zclmsg.content->ffn (_u.zclmsg.content->data,\n    251\t                                     _u.zclmsg.content->hint);\n    252\t         }\n    253\t     }\n    254\t \n    255\t     if (_u.base.metadata != NULL) {\n────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── threads ────\n[#0] Id 1, Name: "demo", stopped, reason: SINGLE STEP\n[#1] Id 2, Name: "demo", stopped, reason: SINGLE STEP\n[#2] Id 3, Name: "ZMQbg/0", stopped, reason: SINGLE STEP\n[#3] Id 4, Name: "ZMQbg/1", stopped, reason: SINGLE STEP\n──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── trace ────\n[#0] 0x7f82565de009 → zmq::msg_t::close(this=0x7f824800ba98)\n[#1] 0x7f8256621778 → zmq::v2_decoder_t::~v2_decoder_t(this=0x7f824800ba30, __in_chrg=<optimized out>)\n[#2] 0x7f8256621810 → zmq::v2_decoder_t::~v2_decoder_t(this=0x7f824800ba30, __in_chrg=<optimized out>)\n[#3] 0x7f8256611c7f → zmq::stream_engine_t::~stream_engine_t(this=0x7f8248000b40, __in_chrg=<optimized out>)\n[#4] 0x7f8256611d4e → zmq::stream_engine_t::~stream_engine_t(this=0x7f8248000b40, __in_chrg=<optimized out>)\n[#5] 0x7f82566163e8 → zmq::stream_engine_t::error(this=0x7f8248000b40, reason_=zmq::stream_engine_t::connection_error)\n[#6] 0x7f8256612856 → zmq::stream_engine_t::in_event(this=0x7f8248000b40)\n[#7] 0x7f82565d13f0 → zmq::epoll_t::loop(this=0x7f8250004f40)\n[#8] 0x7f82565efa8d → zmq::worker_poller_base_t::worker_routine(arg_=0x7f8250004f40)\n[#9] 0x7f825661c13c → thread_routine(arg_=0x7f8250004f98)\n───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────\n\n')])])]),f("p",[e._v("call system")]),e._v(" "),f("div",{staticClass:"language- extra-class"},[f("pre",{pre:!0,attrs:{class:"language-text"}},[f("code",[e._v('$rax   : 0x00007f82562e5770  →  <system_compat+0> jmp 0x7f82562d87e0 <__libc_system@plt>\n$rbx   : 0x0               \n$rcx   : 0x0               \n$rdx   : 0x0000555a718460c0  →  0x0000696d616f6877 ("whoami"?)\n$rsp   : 0x00007f824fffdff0  →  0x0000000000000000\n$rbp   : 0x00007f824fffe010  →  0x00007f824fffe040  →  0x00007f824fffe060  →  0x00007f824fffe0b0  →  0x00007f824fffe0d0  →  0x00007f824fffe150  →  0x00007f824fffe1a0  →  0x00007f824fffee00\n$rsi   : 0x0               \n$rdi   : 0x0000555a718460c0  →  0x0000696d616f6877 ("whoami"?)\n$rip   : 0x00007f82565de009  →  <zmq::msg_t::close()+441> call rax\n$r8    : 0x0               \n$r9    : 0x0               \n$r10   : 0x00007f8248001134  →  0x4800113000000005\n$r11   : 0x0               \n$r12   : 0x00007f824fffefc0  →  0x0000000000000000\n$r13   : 0x0               \n$r14   : 0x00007f8250004f98  →  0x00007f82565efa6a  →  <zmq::worker_poller_base_t::worker_routine(void*)+0> push rbp\n$r15   : 0x00007f8255399910  →  0x00007f8255399950  →  0x00007f82553999a0  →  0x00007f8255399a40  →  0x0000000100000009\n$eflags: [zero carry parity adjust sign trap INTERRUPT direction overflow resume virtualx86 identification]\n$cs: 0x0033 $ss: 0x002b $ds: 0x0000 $es: 0x0000 $fs: 0x0000 $gs: 0x0000 \n──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── stack ────\n0x00007f824fffdff0│+0x0000: 0x0000000000000000\t ← $rsp\n0x00007f824fffdff8│+0x0008: 0x00007f824800ba98  →  0x0000000000000000\n0x00007f824fffe000│+0x0010: 0x00007f824fffe020  →  0x00007f824fffe060  →  0x00007f824fffe0b0  →  0x00007f824fffe0d0  →  0x00007f824fffe150  →  0x00007f824fffe1a0  →  0x00007f824fffee00\n0x00007f824fffe008│+0x0018: 0x0000000000000000\n0x00007f824fffe010│+0x0020: 0x00007f824fffe040  →  0x00007f824fffe060  →  0x00007f824fffe0b0  →  0x00007f824fffe0d0  →  0x00007f824fffe150  →  0x00007f824fffe1a0  →  0x00007f824fffee00\t ← $rbp\n0x00007f824fffe018│+0x0028: 0x00007f8256621778  →  <zmq::v2_decoder_t::~v2_decoder_t()+46> mov DWORD PTR [rbp-0xc], eax\n0x00007f824fffe020│+0x0030: 0x00007f824fffe060  →  0x00007f824fffe0b0  →  0x00007f824fffe0d0  →  0x00007f824fffe150  →  0x00007f824fffe1a0  →  0x00007f824fffee00  →  0x00007f824fffee20\n0x00007f824fffe028│+0x0038: 0x00007f824800ba30  →  0x00007f825687a230  →  0x00007f825662174a  →  <zmq::v2_decoder_t::~v2_decoder_t()+0> push rbp\n────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── code:x86:64 ────\n   0x7f82565de000 <zmq::msg_t::close()+432> mov    rdx, QWORD PTR [rdx]\n   0x7f82565de003 <zmq::msg_t::close()+435> mov    rsi, rcx\n   0x7f82565de006 <zmq::msg_t::close()+438> mov    rdi, rdx\n → 0x7f82565de009 <zmq::msg_t::close()+441> call   rax\n   0x7f82565de00b <zmq::msg_t::close()+443> mov    rax, QWORD PTR [rbp-0x18]\n   0x7f82565de00f <zmq::msg_t::close()+447> mov    rax, QWORD PTR [rax]\n   0x7f82565de012 <zmq::msg_t::close()+450> test   rax, rax\n   0x7f82565de015 <zmq::msg_t::close()+453> je     0x7f82565de05c <zmq::msg_t::close()+524>\n   0x7f82565de017 <zmq::msg_t::close()+455> mov    rax, QWORD PTR [rbp-0x18]\n────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── arguments (guessed) ────\n*0x7f82562e5770 (\n   $rdi = 0x0000555a718460c0 → 0x0000696d616f6877 ("whoami"?),\n   $rsi = 0x0000000000000000,\n   $rdx = 0x0000555a718460c0 → 0x0000696d616f6877 ("whoami"?),\n   $rcx = 0x0000000000000000\n)\n─────────────────────────────────────────────────────────────────────────────────────────────────── source:/home/fan/github/libzmq/src/msg.cpp+250 ────\n    245\t             || !_u.zclmsg.content->refcnt.sub (1)) {\n    246\t             //  We used "placement new" operator to initialize the reference\n    247\t             //  counter so we call the destructor explicitly now.\n    248\t             _u.zclmsg.content->refcnt.~atomic_counter_t ();\n    249\t \n →  250\t             _u.zclmsg.content->ffn (_u.zclmsg.content->data,\n    251\t                                     _u.zclmsg.content->hint);\n    252\t         }\n    253\t     }\n    254\t \n    255\t     if (_u.base.metadata != NULL) {\n────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── threads ────\n[#0] Id 1, Name: "demo", stopped, reason: SINGLE STEP\n[#1] Id 2, Name: "demo", stopped, reason: SINGLE STEP\n[#2] Id 3, Name: "ZMQbg/0", stopped, reason: SINGLE STEP\n[#3] Id 4, Name: "ZMQbg/1", stopped, reason: SINGLE STEP\n──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── trace ────\n[#0] 0x7f82565de009 → zmq::msg_t::close(this=0x7f824800ba98)\n[#1] 0x7f8256621778 → zmq::v2_decoder_t::~v2_decoder_t(this=0x7f824800ba30, __in_chrg=<optimized out>)\n[#2] 0x7f8256621810 → zmq::v2_decoder_t::~v2_decoder_t(this=0x7f824800ba30, __in_chrg=<optimized out>)\n[#3] 0x7f8256611c7f → zmq::stream_engine_t::~stream_engine_t(this=0x7f8248000b40, __in_chrg=<optimized out>)\n[#4] 0x7f8256611d4e → zmq::stream_engine_t::~stream_engine_t(this=0x7f8248000b40, __in_chrg=<optimized out>)\n[#5] 0x7f82566163e8 → zmq::stream_engine_t::error(this=0x7f8248000b40, reason_=zmq::stream_engine_t::connection_error)\n[#6] 0x7f8256612856 → zmq::stream_engine_t::in_event(this=0x7f8248000b40)\n[#7] 0x7f82565d13f0 → zmq::epoll_t::loop(this=0x7f8250004f40)\n[#8] 0x7f82565efa8d → zmq::worker_poller_base_t::worker_routine(arg_=0x7f8250004f40)\n[#9] 0x7f825661c13c → thread_routine(arg_=0x7f8250004f98)\n')])])]),f("h2",{attrs:{id:"_0x4-fuzzing"}},[f("a",{staticClass:"header-anchor",attrs:{href:"#_0x4-fuzzing","aria-hidden":"true"}},[e._v("#")]),e._v(" 0x4 Fuzzing")]),e._v(" "),f("p",[e._v("..........")])])}],s=n(1),a=Object(s.a)({},function(){this.$createElement;this._self._c;return this._m(0)},f,!1,null,null,null);t.default=a.exports}}]);