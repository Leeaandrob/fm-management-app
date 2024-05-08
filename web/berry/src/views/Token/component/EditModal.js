import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTheme } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Autocomplete,
  Checkbox,
  TextField,
  Switch,
  FormHelperText
} from '@mui/material';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderQuotaWithPrompt, showSuccess, showError } from 'utils/common';
import { API } from 'utils/api';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { createFilterOptions } from '@mui/material/Autocomplete';
require('dayjs/locale/zh-cn');
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const filter = createFilterOptions();

const validationSchema = Yup.object().shape({
  is_edit: Yup.boolean(),
  name: Yup.string().required('Name cannot be empty'),
  remain_quota: Yup.number().min(0, 'Must be greater than or equal to 0'),
  expired_time: Yup.number(),
  unlimited_quota: Yup.boolean()
});

const originInputs = {
  is_edit: false,
  name: '',
  remain_quota: 0,
  expired_time: -1,
  unlimited_quota: false,
  subnet: '',
  models: []
};

const EditModal = ({ open, tokenId, onCancel, onOk }) => {
  const theme = useTheme();
  const [inputs, setInputs] = useState(originInputs);
  const [modelOptions, setModelOptions] = useState([]);

  const submit = async (values, { setErrors, setStatus, setSubmitting }) => {
    setSubmitting(true);

    values.remain_quota = parseInt(values.remain_quota);
    let res;
    let models = values.models.join(',');
    if (values.is_edit) {".Translation:
```
res = await API.put(`/api/token/`, { ...values, id: parseInt(tokenId), models: models });
    } else {
      res = await API.post(`/api/token/`, { ...values, models: models });
    }
    const { success, message } = res.data;
    if (success) {
      if (values.is_edit) {
        showSuccess('Token updated successfully!');
      } else {
        showSuccess('Token created successfully, please click copy on the list page to get the token!');
      }
      setSubmitting(false);
      setStatus({ success: true });
      onOk(true);
    } else {
      showError(message);
      setErrors({ submit: message });
    }
  };

  const loadToken = async () => {
    let res = await API.get(`/api/token/${tokenId}`);
    const { success, message, data } = res.data;
    if (success) {
      data.is_edit = true;
      if (data.models === '') {
        data.models = [];
      } else {
        data.models = data.models.split(',');
      }
      setInputs(data);
    } else {
      showError(message);
    }
  };
  const loadAvailableModels = async () => {
    let res = await API.get(`/api/user/available_models`);
    const { success, message, data } = res.data;
    if (success) {
      setModelOptions(data);
    } else {
      showError(message);
    }
  };

  useEffect(() => {
    if (tokenId) {
      loadToken().then();
    } else {
      setInputs({ ...originInputs });
    }
    loadAvailableModels().then();
  }, [tokenId]);

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth={'md'}>
      <DialogTitle
        sx={{
          margin: '0px',
          fontWeight: 700,
          lineHeight: '1.55556',
          padding: '24px',
          fontSize: '1.125rem'
        }}
      >
        {tokenId ? 'Edit Token' : 'Create Token'}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Alert severity="info">Note that the token limit is only used to limit the maximum usage amount of the token itself, and the actual usage is limited by the remaining amount of the account.</Alert>
        <Formik initialValues={inputs} enableReinitialize validationSchema={validationSchema} onSubmit={submit};
```Instructions: Translate the following Chinese text to English 
while maintaining the original formatting: 
```
format: Return only the translated content, not including the original text.
```- "Please select the models that are allowed to be used. Leave blank for no restrictions."  
- "Please enter the IP range that is allowed to access, e.g. 192.168.0.0/24, please separate multiple ranges with a comma."```
})}
              </FormControl>
              {values.expired_time !== -1 && (
                <FormControl fullWidth error={Boolean(touched.expired_time && errors.expired_time)} sx={{ ...theme.typography.otherInput }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en-us'}>
                    <DateTimePicker
                      label="Expiration Time"
                      ampm={false}
                      value={dayjs.unix(values.expired_time)}
                      onError={(newError) => {
                        if (newError === null) {
                          setFieldError('expired_time', null);
                        } else {
                          setFieldError('expired_time', 'Invalid date');
                        }
                      }}
                      onChange={(newValue) => {
                        setFieldValue('expired_time', newValue.unix());
                      }}
                      slotProps={{
                        actionBar: {
                          actions: ['today', 'accept']
                        }
                      }}
                    />
                  </LocalizationProvider>
                  {errors.expired_time && (
                    <FormHelperText error id="helper-tex-channel-expired_time-label">
                      {errors.expired_time}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
              <Switch
                checked={values.expired_time === -1}
                onClick={() => {
                  if (values.expired_time === -1) {
                    setFieldValue('expired_time', Math.floor(Date.now() / 1000));
                  } else {
                    setFieldValue('expired_time', -1);
                  }
                }}
              />{' '}
              Never Expires
              <FormControl fullWidth error={Boolean(touched.remain_quota && errors.remain_quota)} sx={{ ...theme.typography.otherInput }}>
``````
<InputLabel htmlFor="channel-remain_quota-label">Quota</InputLabel>
<OutlinedInput
  id="channel-remain_quota-label"
  label="Quota"
  type="number"
  value={values.remain_quota}
  name="remain_quota"
  endAdornment={<InputAdornment position="end">{renderQuotaWithPrompt(values.remain_quota)}</InputAdornment>}
  onBlur={handleBlur}
  onChange={handleChange}
  aria-describedby="helper-text-channel-remain_quota-label"
  disabled={values.unlimited_quota}
/>

{touched.remain_quota && errors.remain_quota && (
  <FormHelperText error id="helper-tex-channel-remain_quota-label">
    {errors.remain_quota}
  </FormHelperText>
)}
</FormControl>
<Switch
  checked={values.unlimited_quota === true}
  onClick={() => {
    setFieldValue('unlimited_quota', !values.unlimited_quota);
  }}
/>{' '}
Unlimited Quota
<DialogActions>
  <Button onClick={onCancel}>Cancel</Button>
  <Button disableElevation disabled={isSubmitting} type="submit" variant="contained" color="primary">
    Submit
  </Button>
</DialogActions>
</form>
)}
</Formik>
</DialogContent>
</Dialog>
);

export default EditModal;

EditModal.propTypes = {
  open: PropTypes.bool,
  tokenId: PropTypes.number,
  onCancel: PropTypes.func,
  onOk: PropTypes.func
};
```