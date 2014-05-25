#! /usr/bin/python2
# vim: set fileencoding=utf-8
"""Average consumption data from VTT csv file."""
from collections import defaultdict, Counter
import pandas as pd
# from datetime import datetime as dt
import sys
import numpy as np


def avg_pair(p1, p2):
    return (.5*(p1[0]+p2[0]), .5*(p1[1]+p2[1]))


# buildings = sorted([_.strip() for _ in s['building'].unique()])
with open('data/buildings_names.txt') as builds:
    id_ = 0
    abuildings = defaultdict(list)
    for line in builds:
        line = line.strip()
        if line == '':
            id_ += 1
        else:
            abuildings[id_].append(line)


def build_number(name):
    name = name.strip()
    for num, names in abuildings.iteritems():
        if name in names:
            return num
    return -1


fileinput = 'sample8.csv' if len(sys.argv) < 2 else sys.argv[1]
columns = 'id building address type type_name day hour value'.split()
s = pd.read_csv(fileinput, delimiter=',', names=columns)

s['type_name'].unique()
type_name = np.array(['S\xc3\x84HK\xc3\x96               ',
                      'KAUKOL\xc3\x84MP\xc3\x96          ',
                      'LOISTEHO            ',
                      'VESI                ', ], dtype=object)
word_type = dict(zip(type_name, range(1, 5)))

s['word_type'] = s['type_name'].apply(word_type.__getitem__)

s['build_id'] = s['building'].apply(build_number)

# s['dt'] = [dt(int(str(d)[:4]), int(str(d)[4:6]), int(str(d)[6:]), int(h)) for
#            d, h in zip(s['day'], s['hour'])]
# device_by_building = s.groupby(['build_id'])

did = list(s['id'])
bid = list(s['build_id'])
c = Counter(zip(did, bid)).keys()
devices_by_building = defaultdict(list)
for device_id, build_id in sorted(c, key=lambda x: x[1]):
    devices_by_building[build_id].append(device_id)

index = ['id', 'word_type']
devices = s[(s['word_type'] <= 2) & (s['build_id'] != -1)].groupby(index)
m = devices.mean()
m.sort('build_id')

summed_values = defaultdict(lambda: (0, 0))
building_unique_name = [_[0] for _ in abuildings.itervalues()]
for idx, device in m.iterrows():
    build_id = int(device['build_id'])
    name = building_unique_name[build_id]
    kind = idx[1]
    val = device['value']
    vals = (val, 0) if kind == 1 else (0, val)
    current = summed_values[name]
    summed_values[name] = avg_pair(current, vals)

with open('data/consumption.csv', 'w') as out:
    res = ['name\telectricity\theat']
    for name, values in summed_values.iteritems():
        name = name.replace(';', ' ').strip()
        res.append('{}\t{}\t{}'.format(name, *values))
    out.write('\n'.join(res))
