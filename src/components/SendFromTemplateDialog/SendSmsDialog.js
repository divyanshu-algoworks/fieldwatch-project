import React from 'react';
import Common from './Common';
import Button from 'Components/Button';
import Textarea from 'Components/Textarea';
import ComponentWithMergeFields from 'Components/ComponentWithMergeFields';
import API from 'Helpers/api';
import { checkRequired } from 'Helpers/validators';

export default class SendSmsDialog extends Common {
  validators = {
    body: checkRequired('body'),
  };
  // canPreview = false
  handleChangeBody = (body) => this.changeValue('body', body);

  handleSend = (smsToSend = this.state.item) => {
    const { sendUrl, representative, incident, onSuccessSend } = this.props;
    this.setState({ pending: true });
    let sms = { body: smsToSend.body };
    if (smsToSend.id !== undefined) {
      sms.representative_sms_template_id = smsToSend.id;
    }
    API.post(sendUrl, {
      body: {
        representative_id: representative.id,
        incident_id: incident.id,
        to: representative.phone,
        sms,
      }
    }).then(() => {
      this.setState({ pending: false });
      this.close();
      onSuccessSend(sms);
    }, () => {
      this.setState({ pending: false });
      this.close();
    });
  }

  get form() {
    const { item } = this.state;
    const { mergeFields } = this.props;

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="f-r mb-10">
          <Button size="small" status="black" onClick={this.setListView}>
            back to list
          </Button>
          <Button size="small" type="submit">
            send sms
            </Button>
        </div>
        <ComponentWithMergeFields label="Body" onChange={this.handleChangeBody}
          validationMessages={this.validationMessages.body}
          inputComponent={Textarea} rows={7} value={item.body}
          mergeFields={[{ title: 'Body', fields: mergeFields }]} />
      </form>
    );
  }
}
