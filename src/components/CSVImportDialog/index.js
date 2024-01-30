import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import Dialog from 'Components/Dialog';
import Input from 'Components/Input';
import Button from 'Components/Button';
import Papa from 'papaparse';
import isMatch from 'date-fns/isMatch';
import { VALID_EMAIL_REGEX, ALLOWED_HEADERS } from 'Constants/File';
import { LIFETIMERANKS, ALTERNATE_RANKS} from 'Constants/LifeTimeRanksIds';
import {getMissingHeaders, getInvalidHeaders} from 'Helpers/repImport';

export default class CSVImportDialog extends Component {
  state = {
    file: {},
    overwrite: '',
    isUploading: false,
  };

  @autobind handleChangeAction({ target }) {
    this.setState({ overwrite: target.value });
  }

  @autobind handleClose() {
    const { onClose } = this.props;
    onClose();
  }

  @autobind setIsUploading() {
    this.setState({
      isUploading: false,
    });
  }

  @autobind handleChangeFile({ target }) {
    this.setState({ file: target.files[0] || {} });
  }

  uploadFile = (invalidCount = 0, errors) => {
    const { onApply } = this.props;
    const { overwrite, file } = this.state;

    const fileData = {
      overwrite,
      file
    };

    if(invalidCount > 0){
      fileData.invalidCount = invalidCount;
      fileData.errors = JSON.stringify(errors);
    }

    onApply(fileData, this.handleClose, this.setIsUploading);
  }

  @autobind handleApply() {

    const { file } = this.state;

    this.setState({
      isUploading: true,
    });

    const self = this;

    Papa.parse(file, {
      header: true,
      worker: true,
      skipEmptyLines: 'greedy',
      complete: function ({ data, errors, meta }) {
        const firstNameErrors = [];
        const lastNameErrors = [];
        const idErrors = [];
        const joinDateErrors = [];
        const emailErrors = [];
        const WebPresenceErrors = [];
        const ReplicatedSiteErrors = [];

        let errorCount = 0;
        const errorsData = {};

        const headers = meta.fields;

        // Check if file is empty
        if(data.length === 0){
          errorsData['import.rep.file_empty'] = [];
          self.uploadFile(1, errorsData);
          return;
        }

        // Check if required headers are missing
        const missingHeaders = getMissingHeaders(headers);
        if (missingHeaders.length > 0) {
          errorsData['import.rep.missing_header_names'] = missingHeaders;
          self.uploadFile(missingHeaders.length, errorsData)
          return;
        }
        
        // Check for invalid headers
        const invalidHeaders = getInvalidHeaders(headers);
        if (invalidHeaders.length) {
          errorsData['import.rep.invalid_header_names'] = invalidHeaders;
          self.uploadFile(invalidHeaders.length, errorsData)
          return;
        }

        // validate data
        for (let i = 0; i < data.length; i++) {
          const repInfo = data[i];
          if (!repInfo['First Name']) {
            firstNameErrors.push(i + 2);
          }
          if (!repInfo['Last Name']) {
            lastNameErrors.push(i + 2);
          }
          if (!repInfo['ID']) {
            idErrors.push(i + 2);
          }
          if (repInfo['Email'] && !repInfo['Email'].match(VALID_EMAIL_REGEX)) {
            emailErrors.push(i + 2);
          }
          if (
            repInfo['Join Date'] &&
            !isMatch(repInfo['Join Date'], 'MM/dd/yyyy')
          ) {
            joinDateErrors.push(i + 2);
          }
        }

        if (firstNameErrors.length) {
          errorCount += firstNameErrors.length;
          errorsData['import.rep.blank_name'] = firstNameErrors;
        }
        if (lastNameErrors.length) {
          errorCount += lastNameErrors.length;
          errorsData['import.rep.blank_last_name'] = lastNameErrors;
        }
        if (idErrors.length) {
          errorCount += idErrors.length;
          errorsData['import.rep.blank_rep_id'] = idErrors;
        }
        if (emailErrors.length) {
          errorCount += emailErrors.length;
          errorsData['import.rep.invalid_email_format'] = emailErrors;
        }
        if (joinDateErrors.length) {
          errorCount += joinDateErrors.length;
          errorsData['import.rep.incorrect_join_date'] = joinDateErrors;
        }
        if (ReplicatedSiteErrors.length) {
          errorCount += ReplicatedSiteErrors.length;
          errorsData['import.rep.incorrect_replicated_site'] = ReplicatedSiteErrors;
        }
        if (WebPresenceErrors.length) {
          errorCount += WebPresenceErrors.length;
          errorsData['import.rep.incorrect_web_presence'] = WebPresenceErrors;
        }

        self.uploadFile(errorCount, errorsData)
        
      },
    });
  }

  render() {
    const { isOpen, client_id } = this.props;
    const { overwrite, file, isUploading } = this.state;
    const rank_name = ALTERNATE_RANKS.ALTERNATE_RANK_IDS.includes(client_id) ? 'Alternate Rank' : LIFETIMERANKS.LIFETIMERANKSIDS.includes(client_id) ? "'Lifetime Rank'," : ''
    return (
      <Dialog isOpen={isOpen} onClose={this.handleClose}>
        <Dialog.Header onClose={this.handleClose}>CSV Import</Dialog.Header>
        <Dialog.Body>
          <div className="grid">
            <div className="grid__row">
              <div className="grid__col grid__col--12">
                <div className="fs-12 mb-10">
                  Choose csv file (size should not be more than 5 mb)
                </div>
                <Input
                  type="file"
                  accept=".csv"
                  label={
                    <Button type="label" size="small" status="black">
                      Choose the file
                    </Button>
                  }
                  onChange={this.handleChangeFile}
                />
                <div className="ml-10 d-ib">{file.name}</div>
              </div>
            </div>
            <div className="grid__row">
              <div className="grid__col grid__col--12">Action:</div>
            </div>
            <div className="grid__row">
              <div className="grid__col grid__col--12">
                <Input
                  type="radio"
                  checked={overwrite === ''}
                  onChange={this.handleChangeAction}
                  label="none (not touch duplicate IDs)"
                  value=""
                />
              </div>
            </div>
            <div className="grid__row">
              <div className="grid__col grid__col--12">
                <Input
                  type="radio"
                  checked={overwrite === 'all'}
                  onChange={this.handleChangeAction}
                  label="overwrite duplicate IDs"
                  value="all"
                />
              </div>
            </div>
            <div className="grid__row">
              <div className="grid__col grid__col--12">
                <Input
                  type="radio"
                  checked={overwrite === 'blank'}
                  onChange={this.handleChangeAction}
                  label="overwrite duplicate IDs (only blank fields)"
                  value="blank"
                />
              </div>
            </div>
            <div className="grid__row">
              <div className="grid__col grid__col--12">
                <p>
                  {`
                  Your .csv file must have columns titled 'First Name', 'Last
                  Name', and 'ID'. Other optional columns are 'Company Name',
                  'Email', 'Phone', 'Alternate Phone', 'Replicated Site',
                  'Status', 'Rank', ${rank_name} 'Join Date', 'Country','US State' (or 'State'), 'Additional Notes',
                  'Sponsor ID' and 'Preferred Language' `}
                </p>
                <p>
                  'Join Date' column should be US style, i.e "Month/Day/Year",
                  e.g 11/23/2017
                </p>
              </div>
            </div>
          </div>
        </Dialog.Body>
        <Dialog.Footer>
          <Button status="white" onClick={this.handleClose}>
            Close
          </Button>
          <Button
            disabled={!file.name || isUploading}
            onClick={this.handleApply}
          >
            Apply
          </Button>
        </Dialog.Footer>
      </Dialog>
    );
  }
}
