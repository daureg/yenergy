#! /usr/bin/python2
# vim: set fileencoding=utf-8
import flask as f
import json
import urllib2
import base64
import api_keys as ak
APP = f.Flask(__name__)


@APP.route('/air/<dfrom>/<dto>')
def air(dfrom, dto):
    url = "https://api.720.fi/hackathon?from={}&until={}".format(dfrom, dto)
    print(dfrom, dto)
    request = urllib2.Request(url)
    base64string = base64.encodestring('%s:%s' % (ak.USERNAME, ak.PASSWORD))
    request.add_header("Authorization", "Basic %s" % base64string)
    result = None
    try:
        # result = urllib2.urlopen(request).read()
        result = json.loads(urllib2.urlopen(request).read())
        co2 = []
        voc = []
        for timestamp in result['data']['3BDDED2B7A8']:
            co2.append(timestamp['co2'])
            voc.append(timestamp['voc_ch2o_equiv'])
        result = [co2, voc]
    except urllib2.HTTPError as error:
        print(error.read())
    return f.jsonify(r=result)


@APP.route('/')
def index():
    return f.render_template('index.html')

if __name__ == '__main__':
    APP.run(debug=True)
