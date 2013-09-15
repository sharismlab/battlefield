#!/usr/bin/env python
# -*- coding: utf-8 -*-

import gkseg

text = 'THE ETHER MASHUP游趟在这个由无处不在的电子沟通设备所构成的虚拟世界里，把其中那些无声无形的数字活动与地理位置之间错综复杂的关系呈现出来。这个装置通过一个控制间，来映射出某一特定地理区域中源源不断的数字信息活动（比如无线数据，社交媒体流，P2P下载等）。它把这数据流中的图像、文字、声音视频进行有机的重组，再把这些实时的碎片化文件即刻展现。同时，作品也试图通过分析信息传递的起点和终点，勾勒出这个空间中数字活动的拓扑结构，以这种形式表达“超意识”的城市数字空间。'.decode('utf-8')

gkseg.init('gkseg/data/model.txt')

# print "seg -----------"
# seg = gkseg.seg(text)
# for s in seg: #segment the sentence into a list of words
#     print s.encode('utf-8')

print "terms -----------"
terms = gkseg.term(text)
for t in terms: #extract the important words from the sentence
    print t.encode('utf-8')

# print "labels -----------"
# labels = gkseg.label(text)
# for l in labels: #label the sentence
#     print l.encode('utf-8')

gkseg.destroy()

