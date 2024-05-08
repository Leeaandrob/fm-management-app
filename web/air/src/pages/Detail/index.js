Instructions: Translate the following Chinese text to English 
while maintaining the original formatting: "import React, {useEffect, useRef, useState} from 'react';
import {Button, Col, Form, Layout, Row, Spin} from "@douyinfe/semi-ui";
import VChart from '@visactor/vchart';
import {API, isAdmin, showError, timestamp2string, timestamp2string1} from "../../helpers";
import {
    getQuotaWithUnit, modelColorMap,
    renderNumber,
    renderQuota,
    renderQuotaNumberWithDigit,
    stringToColor
} from "../../helpers/render";

const Detail = (props) => {
    const formRef = useRef();
    let now = new Date();
    const [inputs, setInputs] = useState({
        username: '',
        token_name: '',
        model_name: '',
        start_timestamp: localStorage.getItem('data_export_default_time') === 'hour' ? timestamp2string(now.getTime() / 1000 - 86400) : (localStorage.getItem('data_export_default_time') === 'week' ? timestamp2string(now.getTime() / 1000 - 86400 * 30) : timestamp2string(now.getTime() / 1000 - 86400 * 7)),
        end_timestamp: timestamp2string(now.getTime() / 1000 + 3600),
        channel: '',
        data_export_default_time: ''
    });
    const {username, model_name, start_timestamp, end_timestamp, channel} = inputs;
    const isAdminUser = isAdmin();
    const initialized = useRef(false)
    const [modelDataChart, setModelDataChart] = useState(null);
    const [modelDataPieChart, setModelDataPieChart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [quotaData, setQuotaData] = useState([]);
    const [consumeQuota, setConsumeQuota] = useState(0);
    const [times, setTimes] = useState(0);
    const [dataExportDefaultTime, setDataExportDefaultTime] = useState(localStorage.getItem('data_export_default_time') || 'hour');

    const handleInputChange = (value, name) => {
        if (name === 'data_export_default_time') {
            setDataExportDefaultTime(value);
            return
        }
        setInputs((inputs) => ({...inputs, [name]: value}));
    };

    const spec_line = {
        type: 'bar',
        data: [
            {
                id: 'barData',".Instructions: Translate the following Chinese text to English 
while maintaining the original formatting: 
"values: []
            }
        ],
        xField: 'Time',
        yField: 'Usage',
        seriesField: 'Model',
        stack: true,
        legends: {
            visible: true
        },
        title: {
            visible: true,
            text: 'Model Consumption Distribution',
            subtext: '0'
        },
        bar: {
            // The state style of bar
            state: {
                hover: {
                    stroke: '#000',
                    lineWidth: 1
                }
            }
        },
        tooltip: {
            mark: {
                content: [
                    {
                        key: datum => datum['Model'],
                        value: datum => renderQuotaNumberWithDigit(parseFloat(datum['Usage']), 4)
                    }
                ]
            },
            dimension: {
                content: [
                    {
                        key: datum => datum['Model'],
                        value: datum => datum['Usage']
                    }
                ],
                updateContent: array => {
                    // sort by value
                    array.sort((a, b) => b.value - a.value);
                    // add $
                    let sum = 0;
                    for (let i = 0; i < array.length; i++) {
                        sum += parseFloat(array[i].value);
                        array[i].value = renderQuotaNumberWithDigit(parseFloat(array[i].value), 4);
                    }
                    // add to first
                    array.unshift({
                        key: 'Total',
                        value: renderQuotaNumberWithDigit(sum, 4)
                    });
                    return array;
                }
            }
        },
        color: {
            specified: modelColorMap
        }
    };

    const spec_pie = {
        type: 'pie',
        data: [
            {
                id: 'id0',
                values: [
                    {type: 'null', value: '0'},
                ]
            }"instructions: Translate the content inside code comments:

            text: 'Model call count ratio'
        },

        legends: {
            visible: true,
            orient: 'left'
        },
        label: {
            visible: true
        },
        tooltip: {
            mark: {
                content: [
                    {
                        key: datum => datum['type'],
                        value: datum => renderNumber(datum['value'])
                    }
                ]
            }
        },
        color: {
            specified: modelColorMap
        }
    };

    const loadQuotaData = async (lineChart, pieChart) => {
        setLoading(true);

        let url = '';
        let localStartTimestamp = Date.parse(start_timestamp) / 1000;
        let localEndTimestamp = Date.parse(end_timestamp) / 1000;
        if (isAdminUser) {
            url = `/api/data/?username=${username}&start_timestamp=${localStartTimestamp}&end_timestamp=${localEndTimestamp}&default_time=${dataExportDefaultTime}`;
        } else {
            url = `/api/data/self/?start_timestamp=${localStartTimestamp}&end_timestamp=${localEndTimestamp}&default_time=${dataExportDefaultTime}`;
        }
        const res = await API.get(url);
        const {success, message, data} = res.data;
        if (success) {
            setQuotaData(data);
            if (data.length === 0) {
                data.push({
                    'count': 0,
                    'model_name': 'No Data',// Reset the time granularity based on dataExportDefaultTime
            let timeGranularity = 3600;
            if (dataExportDefaultTime === 'day') {
                timeGranularity = 86400;
            } else if (dataExportDefaultTime === 'week') {
                timeGranularity = 604800;
            }// Merge created_at and model_name into lineData, where the data type of created_at is a timestamp in hours.
// Convert date format
let createTime = timestamp2string1(item.created_at, dataExportDefaultTime);
let lineItem = lineData.find(it => it.Time === createTime && it.Model === item.model_name);
if (lineItem) {
    lineItem.Usage += parseFloat(getQuotaWithUnit(item.quota));
} else {
    lineData.push({
        "Time": createTime,
        "Model": item.model_name,
        "Usage": parseFloat(getQuotaWithUnit(item.quota))
    });
}
}
setConsumeQuota(consumeQuota);
setTimes(times);

// sort by count
pieData.sort((a, b) => b.value - a.value);
spec_pie.title.subtext = `Total: ${renderNumber(times)}`;
spec_pie.data[0].values = pieData;

spec_line.title.subtext = `Total: ${renderQuota(consumeQuota, 2)}`;
spec_line.data[0].values = lineData;
pieChart.updateSpec(spec_pie);
lineChart.updateSpec(spec_line);

// pieChart.updateData('id0', pieData);
// lineChart.updateData('barData', lineData);
pieChart.reLayout();
lineChart.reLayout();
}

useEffect(() => {
// setDataExportDefaultTime(localStorage.getItem('data_export_default_time'));
// if (dataExportDefaultTime === 'day') {
// Set the start time to 7 days ago
let st = timestamp2string(now.getTime() / 1000 - 86400 * 7)
inputs.start_timestamp = st;
formRef.current.formApi.setValue('start_timestamp', st);
}
if (!initialized.current) {
initialized.current = true;
initChart();
}
}, []);

return (
<>
<Layout>
    <Layout.Header>
        <h3>Data Dashboard</h3>
    </Layout.Header><Layout.Content>
                    <Form ref={formRef} layout='horizontal' style={{marginTop: 10}}>
                        <>
                            <Form.DatePicker field="start_timestamp" label='Start Time' style={{width: 272}}
                                             initValue={start_timestamp}
                                             value={start_timestamp} type='dateTime'
                                             name='start_timestamp'
                                             onChange={value => handleInputChange(value, 'start_timestamp')}/>
                            <Form.DatePicker field="end_timestamp" fluid label='End Time' style={{width: 272}}
                                             initValue={end_timestamp}
                                             value={end_timestamp} type='dateTime'
                                             name='end_timestamp'
                                             onChange={value => handleInputChange(value, 'end_timestamp')}/>
                            <Form.Select field="data_export_default_time" label='Time Granularity' style={{width: 176}}
                                         initValue={dataExportDefaultTime}
                                         placeholder={'Time Granularity'} name='data_export_default_time'
                                         optionList={
                                             [
                                                 {label: 'Hour', value: 'hour'},
                                                 {label: 'Day', value: 'day'},
                                                 {label: 'Week', value: 'week'}
                                             ]
                                         }
                                         onChange={value => handleInputChange(value, 'data_export_default_time')}>
                            </Form.Select>
                            {
                                isAdminUser && <>"```javascript
<Form.Input field="username" label='Username' style={{width: 176}} value={username}
                                                placeholder={'Optional value'} name='username'
                                                onChange={value => handleInputChange(value, 'username')}/>
                            </>
                        }
                        <Form.Section>
                            <Button label='Search' type="primary" htmlType="submit" className="btn-margin-right"
                                    onClick={refresh} loading={loading}>Search</Button>
                        </Form.Section>
                    </>
                </Form>
                <Spin spinning={loading}>
                    <div style={{height: 500}}>
                        <div id="model_pie" style={{width: '100%', minWidth: 100}}></div>
                    </div>
                    <div style={{height: 500}}>
                        <div id="model_data" style={{width: '100%', minWidth: 100}}></div>
                    </div>
                </Spin>
            </Layout.Content>
        </Layout>
    </>
);
```