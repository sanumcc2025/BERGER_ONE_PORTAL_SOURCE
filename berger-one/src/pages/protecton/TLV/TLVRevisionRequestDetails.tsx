import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import { UseAuthStore } from '../../../services/store/AuthStore';
import { useNavigate } from 'react-router-dom';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { GetApplicableDepotList, GetApplicableTerrList } from '../../../services/api/protectonEpca/EpcaList';
import { GetPcaBillToList, GetPcaDealersList } from '../../../services/api/protectonEpca/EpcaDetails';
import { GetBillToDetails } from '../../../services/api/protectonEpca/EPCADepotApproval';
import { GetTlvDetails } from '../../../services/api/protectonEpca/TLVRevisionRSMApproval';
import { commonErrorToast, commonSuccessToast } from '../../../services/functions/commonToast';
import { Button } from '@mantine/core';
import AnimateHeight from 'react-animate-height';
import Flatpickr from 'react-flatpickr';
import { ValidateIFSC } from '../../../services/api/commons/global';
import { FaDownload } from "react-icons/fa";
import { IoMdSave } from 'react-icons/io';
import { IoReturnUpBack } from "react-icons/io5";
import { commonAlert } from '../../../services/functions/commonAlert';
import { TlvDetailsSubmit } from '../../../services/api/protectonEpca/TLVRevisionDepotApproval';
import moment from 'moment';

const TLVRevisionRequestDetails = () => {
    const user = UseAuthStore((state: any) => state.userDetails);
    const navigate = useNavigate();

    const [accordianOpen, setAccordianOpen] = useState<string>('');
    const [getTlvDetailsCalled, setGetTlvDetailsCalled] = useState<boolean>(false);
    const [detailsData, setDetailsData] = useState<any>({ auto_id: 0, depot: null, territory: null, dealer: null, billTo: null, file_doc: null, keyParam: [], outstanding: [] });
    const [loading, setLoading] = useState(false);
    const [pageType, setPageType] = useState('');
    const [sessionStorageData, setSessionStorageData] = useState<any>({ td_submission_type: "TLV" });
    const [selectBoxData, setSelectBoxData] = useState<any>({ depot: [], territory: [], dealer: [], billTo: [], customerAndPaymentType: [] });
    const [tlvBase64JPEG, setTlvBase64JPEG] = useState<any>('');
    const [aadharBase64JPEG, setAadharBase64JPEG] = useState<any>('');
    const [panBase64JPEG, setPanBase64JPEG] = useState<any>('');
    const [lcBase64JPEG, setLcBase64JPEG] = useState<any>('');
    const [chequeBase64JPEG, setChequeBase64JPEG] = useState<any>('');
    const [lcbgBase64JPEG, setlcbgBase64JPEG] = useState<any>('');

    const GetApplicableDepot = async () => {
        setLoading(true);
        const data: any = {
            user_id: user.user_id,
            region: '',
            app_id: '15',
        };
        try {
            const response: any = await GetApplicableDepotList(data);
            setSelectBoxData((pre: any) => ({ ...pre, depot: response.data || [] }));
        } catch (error) {
            return;
        }
        setLoading(false);
    };

    const GetApplicableTerritory = async ({ depot_code }: any) => {
        setLoading(true);
        const data: any = {
            user_id: user.user_id,
            depot_code: depot_code,
            app_id: '15',
        };
        try {
            const response: any = await GetApplicableTerrList(data);
            setSelectBoxData((pre: any) => ({ ...pre, territory: response.data || [] }));
        } catch (error) {
            return;
        }
        setLoading(false);
    };

    const GetDealerList = async ({ depot_code, terr_code }: any) => {
        setLoading(true);
        const data: any = {
            depot_code: depot_code,
            terr_code: terr_code,
            sbl_code: '4',
        };
        try {
            const response: any = await GetPcaDealersList(data);
            setSelectBoxData((pre: any) => ({ ...pre, dealer: response.data || [] }));
        } catch (error) {
            return;
        }
        setLoading(false);
    };

    const GetApplicableBillto = async ({ depot_code, terr_code, dealer_code }: any) => {
        setLoading(true);
        const data: any = {
            depot_code: depot_code,
            terr_code: terr_code,
            dealer_code: dealer_code,
        };
        try {
            const response: any = await GetPcaBillToList(data);
            setSelectBoxData((pre: any) => ({ ...pre, billTo: response.data || [] }));
        } catch (error) {
            return;
        }
        setLoading(false);
    };

    const GetCustomerAndPaymentType = async ({ DepotCode, BillToCode }: any) => {
        setLoading(true);
        const data: any = {
            DepotCode: DepotCode,
            BillToCode: BillToCode,
        };
        try {
            const response: any = await GetBillToDetails(data);
            setSelectBoxData((pre: any) => ({ ...pre, customerAndPaymentType: response?.data?.table || [] }));
        } catch (error) {
            return;
        }
        setLoading(false);
    };

    const GetTLVDetailsData = async ({ auto_id, depot_code, dlr_bill_to, dlr_dealer_code, dlr_terr_code, td_submission_type }: any) => {
        setLoading(true);
        const entryType: any = (sessionStorage.getItem('epcaTLVDtlEntryType'));
        const value: any = (sessionStorage.getItem('epcaTLVDtlList'));
        const parsedValue = JSON.parse(value);
        const data: any = {
            auto_id: auto_id,
            depotCode: depot_code,
            billToCode: dlr_bill_to,
            dealerCode: dlr_dealer_code,
            sblCode: '4',
            submissionType: td_submission_type,
            appName: 'PROTECTON',
        };
        try {
            const response: any = await GetTlvDetails(data);

            if (JSON.parse(entryType) === 'View') {
                const depotdata: any = {
                    user_id: user.user_id,
                    region: '',
                    app_id: '15',
                };
                try {
                    const depotResponse: any = await GetApplicableDepotList(depotdata);

                    const terrdata: any = {
                        user_id: user.user_id,
                        depot_code: depot_code,
                        app_id: '15',
                    };
                    try {
                        const terrResponse: any = await GetApplicableTerrList(terrdata);

                        const dealerdata: any = {
                            depot_code: depot_code,
                            terr_code: dlr_terr_code,
                            sbl_code: '4',
                        };
                        try {
                            const dealerResponse: any = await GetPcaDealersList(dealerdata);

                            const billTodata: any = {
                                depot_code: depot_code,
                                terr_code: dlr_terr_code,
                                dealer_code: dlr_dealer_code,
                            };
                            if (parsedValue?.td_submission_type === 'CREDIT_DAYS' || parsedValue?.td_submission_type === 'TLV_AND_CREDIT_DAYS') {
                                try {
                                    const billToResponse: any = await GetPcaBillToList(billTodata);

                                    const customerAndPaymentTypedata: any = {
                                        DepotCode: depot_code,
                                        BillToCode: dlr_bill_to,
                                    };
                                    try {
                                        const customerAndPaymentTypeResponse: any = await GetBillToDetails(customerAndPaymentTypedata);

                                        setSelectBoxData({
                                            depot: depotResponse.data || [],
                                            territory: terrResponse.data || [],
                                            dealer: dealerResponse.data || [],
                                            billTo: billToResponse.data || [],
                                            customerAndPaymentType: customerAndPaymentTypeResponse?.data?.table || []
                                        })
                                        console.log(depotResponse.data, terrResponse.data, dealerResponse.data, billToResponse.data, customerAndPaymentTypeResponse?.data?.table)

                                        setDetailsData((pre: any) => ({
                                            ...pre,
                                            depot: { value: depotResponse.data.find((d: any) => d.depot_code === parsedValue?.depot_code)?.depot_code, label: depotResponse.data.find((d: any) => d.depot_code === parsedValue?.depot_code)?.depot_name },
                                            territory: { value: terrResponse.data.find((d: any) => d.terr_code === parsedValue?.dlr_terr_code)?.terr_code, label: terrResponse.data.find((d: any) => d.terr_code === parsedValue?.dlr_terr_code)?.terr_name },
                                            dealer: { value: dealerResponse?.data.find((d: any) => d.dealer_code === parsedValue?.dlr_dealer_code)?.dealer_code, label: dealerResponse?.data.find((d: any) => d.dealer_code === parsedValue?.dlr_dealer_code)?.dealer_name },
                                            billTo: { value: billToResponse?.data.find((d: any) => d.bill_to === parsedValue?.dlr_bill_to)?.dealer_code, label: billToResponse?.data.find((d: any) => d.bill_to === parsedValue?.dlr_bill_to)?.bill_to_name },
                                            ...response.data.table[0], ...response.data.table2[0], keyParam: response.data.table4, outstanding: response.data.table5
                                        }));
                                    } catch (error) {
                                        return;
                                    }
                                } catch (error) {
                                    return;
                                }
                            } else {
                                setSelectBoxData({
                                    depot: depotResponse.data || [],
                                    territory: terrResponse.data || [],
                                    dealer: dealerResponse.data || [],
                                    billTo: [],
                                    customerAndPaymentType: []
                                })
                                setDetailsData((pre: any) => ({
                                    ...pre,
                                    depot: { value: depotResponse.data.find((d: any) => d.depot_code === parsedValue?.depot_code)?.depot_code, label: depotResponse.data.find((d: any) => d.depot_code === parsedValue?.depot_code)?.depot_name },
                                    territory: { value: terrResponse.data.find((d: any) => d.terr_code === parsedValue?.dlr_terr_code)?.terr_code, label: terrResponse.data.find((d: any) => d.terr_code === parsedValue?.dlr_terr_code)?.terr_name },
                                    dealer: { value: dealerResponse?.data.find((d: any) => d.dealer_code === parsedValue?.dlr_dealer_code)?.dealer_code, label: dealerResponse?.data.find((d: any) => d.dealer_code === parsedValue?.dlr_dealer_code)?.dealer_name },
                                    billTo: null,
                                    ...response.data.table[0], ...response.data.table2[0], keyParam: response.data.table4, outstanding: response.data.table5
                                }));
                            }
                        } catch (error) {
                            return;
                        }
                    } catch (error) {
                        return;
                    }
                } catch (error) {
                    return;
                }
            } else {
                setDetailsData((pre: any) => ({ ...pre, ...response.data.table[0], ...response.data.table2[0], keyParam: response.data.table4, outstanding: response.data.table5 }));
            }
            setGetTlvDetailsCalled(true);
        } catch (error) {
            console.log(error)
        }
        setLoading(false);
    };

    const convertToBase64 = (value: Blob, typeName: string, fileInput?: HTMLInputElement) => {
        if (value) {
            if (!(value.type && value.type.startsWith('image/'))) {
                commonErrorToast('Please select only image files (e.g. JPEG, PNG, GIF).');
                if (fileInput) fileInput.value = '';
                return;
            }
            if (value.size > 300000) {
                commonErrorToast(`${typeName} file too large!`);
                if (fileInput) fileInput.value = '';
                return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(value);
            reader.onload = () => {
                const base64String: any = reader.result;
                const replacedString = base64String.replace(/(png)|(jpg)/, 'jpeg');
                if (typeName == 'TLV DOC') setTlvBase64JPEG(replacedString);
                if (typeName == 'AADHAR DOC') setAadharBase64JPEG(replacedString);
                if (typeName == 'PAN DOC') setPanBase64JPEG(replacedString);
                if (typeName == 'LC/BG DOC') setLcBase64JPEG(replacedString);
                if (typeName == 'CHEQUE DOC') setChequeBase64JPEG(replacedString);
                if (typeName == 'LCBG DOC') setlcbgBase64JPEG(replacedString);
            };
            reader.onerror = (error) => {
                commonErrorToast(`Error: ${error}`);
            };
        }
    };
    const imageChange = (event: any, flag: 'TLV DOC' | 'AADHAR DOC' | 'PAN DOC' | 'LC/BG DOC' | 'CHEQUE DOC' | 'LCBG DOC') => {
        convertToBase64(event.target.files[0], flag, event.target);
    };

    const handleDownload = (event: React.MouseEvent<HTMLButtonElement>, fileUrl: string) => {
        event.preventDefault();
        const link = document.createElement('a');
        link.href = fileUrl;
        link.target = '_blank';
        link.click();
    };

    const convertToDate = (dateStr: any) => {
        if (typeof dateStr === 'string') {
            const [day, month, year] = dateStr.split('/');
            return new Date(`${year}-${month}-${day}`);
        }
        return dateStr;
    };

    const handleIFSCValidate = async () => {
        setLoading(true);
        const data = {
            common_request: detailsData.td_ifsc_code,
        };
        try {
            const response: any = await ValidateIFSC(data);
            if (response.statusCode === 200 && response.data != null) {
                const { bank, branch, message } = response.data;
                setDetailsData((pre: any) => ({ ...pre, bankName: bank, branch: branch, message: message || 'Valid IFSC.', success: true }))
            } else {
                setDetailsData((pre: any) => ({ ...pre, message: response.message || 'Invalid IFSC.', success: false }))
            }
        } catch (error) {
            setDetailsData((pre: any) => ({ ...pre, message: 'An error occurred during validation!', success: false }))
        }
        setLoading(false);
    };

    async function showSubmitAlert(data: any) {
        commonAlert('Are you want to insert the TLV Revision Request Info?', '', 'warning').then(async (result: any) => {
            if (result.value) {
                const response: any = await TlvDetailsSubmit(data[0]);
                if (response) {
                    if (response.statusCode == 200) {
                        commonSuccessToast(`TLV Revision Request ` + response.message);
                        navigate('/Protecton/TLV/TLVRevisionRequestList/');
                    } else commonErrorToast(response.message);
                } else commonErrorToast('Error occured while submitting TLV Revision!');
            }
        });
    }
    const handleFormSubmit = () => {
        const entity = [{
            appName: 'PROTECTON',
            userId: user.user_id || '',
            autoId: detailsData?.auto_id || 0,
            depotCode: detailsData?.depot?.value || '',
            dealerCode: detailsData?.dealer?.value || '',
            billtoCode: detailsData?.billTo?.value || '',
            fullName: detailsData?.full_name || '',
            // holderName: detailsData?.holderName || '',
            aadharNo: detailsData?.aadhar_no || '',
            aadharDoc: aadharBase64JPEG,
            panNo: detailsData?.pan_no || '',
            panDoc: panBase64JPEG,
            increaseReason: detailsData?.increase_reason || '',
            customerName: detailsData?.customer_name || '',
            lcbgApplYn: detailsData?.lcbg_appl_yn || '',
            lcbgDoc: lcbgBase64JPEG,
            chequeNo: detailsData?.td_blank_chq_no || '',
            ifscCode: detailsData?.td_ifsc_code || '',
            bankName: detailsData?.bankName || '',
            branchName: detailsData?.branch || '',
            chequeDoc: chequeBase64JPEG,
            chequeStatus: 'NA', // ??
            status: detailsData?.status || '',
            remarks: '',
            submissionType: sessionStorageData?.td_submission_type || '',
            fileDoc: tlvBase64JPEG,
            proposedCrDays: detailsData?.proposed_cr_days || '',
            proposedTlv: detailsData?.proposed_tlv || '',
            orderVol: detailsData?.order_vol || '',
            orderVal: detailsData?.order_val || '',
            lcbgAmount: detailsData?.lcbg_amount || '',
            collectionAmount1: detailsData.collectionAmount1 ? Number(detailsData.collectionAmount1) : null,
            collectionAmount2: detailsData.collectionAmount2 ? Number(detailsData.collectionAmount2) : null,
            collectionAmount3: detailsData.collectionAmount3 ? Number(detailsData.collectionAmount3) : null,
            collectionAmount4: detailsData.collectionAmount4 ? Number(detailsData.collectionAmount4) : null,
            collectionAmount5: detailsData.collectionAmount5 ? Number(detailsData.collectionAmount5) : null,
            collectionAmount6: detailsData.collectionAmount6 ? Number(detailsData.collectionAmount6) : null,
            collectionAmount7: detailsData.collectionAmount7 ? Number(detailsData.collectionAmount7) : null,
            lcbgOpeningDate: moment(convertToDate(detailsData.frm_date)).format('YYYY-MM-DD') == 'Invalid date' ? null : moment(convertToDate(detailsData.frm_date)).format('YYYY-MM-DD'),
            lcbgExpiryDate: moment(convertToDate(detailsData.to_date)).format('YYYY-MM-DD') == 'Invalid date' ? null : moment(convertToDate(detailsData.to_date)).format('YYYY-MM-DD'),
            osCollectionDate1: moment(detailsData.collection1_date).format('YYYY-MM-DD') == 'Invalid date' ? null : moment(detailsData.collection1_date).format('YYYY-MM-DD'),
            osCollectionDate2: moment(detailsData.collection2_date).format('YYYY-MM-DD') == 'Invalid date' ? null : moment(detailsData.collection2_date).format('YYYY-MM-DD'),
            osCollectionDate3: moment(detailsData.collection3_date).format('YYYY-MM-DD') == 'Invalid date' ? null : moment(detailsData.collection3_date).format('YYYY-MM-DD'),
            osCollectionDate4: moment(detailsData.collection4_date).format('YYYY-MM-DD') == 'Invalid date' ? null : moment(detailsData.collection4_date).format('YYYY-MM-DD'),
            osCollectionDate5: moment(detailsData.collection5_date).format('YYYY-MM-DD') == 'Invalid date' ? null : moment(detailsData.collection5_date).format('YYYY-MM-DD'),
            osCollectionDate6: moment(detailsData.collection6_date).format('YYYY-MM-DD') == 'Invalid date' ? null : moment(detailsData.collection6_date).format('YYYY-MM-DD'),
            osCollectionDate7: moment(detailsData.collection7_date).format('YYYY-MM-DD') == 'Invalid date' ? null : moment(detailsData.collection7_date).format('YYYY-MM-DD'),
            outputCode: 0,
            outputMsg: '',
            file_doc: tlvBase64JPEG
        }];
        // console.log('data in showSubmitAlert:', entity)
        showSubmitAlert(entity)
    }

    const handleBackButton = () => {
        commonAlert('Are you sure?', '', 'warning').then(async (result: any) => {
            if (result.value) navigate('/Protecton/TLV/TLVRevisionRequestList/');
        });
    };

    useEffect(() => {
        const entryType: any = (sessionStorage.getItem('epcaTLVDtlEntryType'));
        setPageType(JSON.parse(entryType))
        if (JSON.parse(entryType) === 'View') {
            const value: any = (sessionStorage.getItem('epcaTLVDtlList'));
            setSessionStorageData(JSON.parse(value));
            const parsedValue = JSON.parse(value);
            if (parsedValue) {
                GetTLVDetailsData({
                    auto_id: parsedValue.auto_id,
                    depot_code: parsedValue.depot_code,
                    dlr_bill_to: parsedValue.dlr_bill_to,
                    dlr_dealer_code: parsedValue.dlr_dealer_code,
                    dlr_terr_code: parsedValue.dlr_terr_code,
                    td_submission_type: parsedValue.td_submission_type
                });
            }
        } else
            GetApplicableDepot();
    }, [])

    useEffect(() => {
        console.log(detailsData)
    }, [detailsData])
    // useEffect(() => {
    //     console.log(selectBoxData)
    // }, [selectBoxData])

    return (
        <>
            <div className="page-titlebar flex items-center justify-between bg-white px-4 py-2">
                <h5 className="text-lg font-semibold dark:text-white-light">TLV Details</h5>
            </div>

            <div className="panel mb-3">
                <form className="space-y-2">
                    <div className="grid grid-cols-1 gap-2">
                        <div style={{ marginLeft: 5 }}>
                            <RadioGroup
                                className="custRadioGroup"
                                row
                                value={sessionStorageData?.td_submission_type || 'TLV'}
                                onChange={(event) => setSessionStorageData((pre: any) => ({ ...pre, td_submission_type: event.target.value }))}
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                            >
                                <FormControlLabel value="TLV" control={<Radio />} label="TLV Only" disabled={pageType === 'View'} />
                                <FormControlLabel value="CREDIT_DAYS" control={<Radio />} label="Credit Days Only" disabled={pageType === 'View'} />
                                <FormControlLabel value="TLV_AND_CREDIT_DAYS" control={<Radio />} label="Both" disabled={pageType === 'View'} />
                            </RadioGroup>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
                        <div>
                            <label className="formLabelTx">Depot:</label>
                            <Select
                                isSearchable={true}
                                value={detailsData?.depot}
                                options={selectBoxData?.depot.map((d: any) => ({ value: d.depot_code, label: d.depot_name }))}
                                isDisabled={pageType === 'View'}
                                onChange={(event) => {
                                    setDetailsData((pre: any) => ({
                                        ...pre, depot: event, territory: null, dealer: null, billTo: null
                                    }))
                                    GetApplicableTerritory({ depot_code: event?.value });
                                }}
                            />
                        </div>
                        <div>
                            <label className="formLabelTx">Territory:</label>
                            <Select
                                isSearchable={true}
                                value={detailsData?.territory}
                                options={selectBoxData?.territory.map((d: any) => ({ value: d.terr_code, label: d.terr_name }))}
                                isDisabled={pageType === 'View'}
                                onChange={(event) => {
                                    setDetailsData((pre: any) => ({
                                        ...pre, territory: event, dealer: null, billTo: null
                                    }))
                                    GetDealerList({ depot_code: detailsData?.depot?.value, terr_code: event?.value });
                                }}
                            />
                        </div>
                        <div>
                            <label className="formLabelTx">Customer:</label>
                            <Select
                                isSearchable={true}
                                value={detailsData?.dealer}
                                options={selectBoxData?.dealer.map((d: any) => ({ value: d.dealer_code, label: d.dealer_name }))}
                                isDisabled={pageType === 'View'}
                                onChange={(event) => {
                                    setDetailsData((pre: any) => ({
                                        ...pre, dealer: event, billTo: null
                                    }))
                                    GetApplicableBillto({ depot_code: detailsData?.depot?.value, terr_code: detailsData?.territory?.value, dealer_code: event?.value })
                                }}
                            />
                        </div>
                        {(sessionStorageData?.td_submission_type === 'CREDIT_DAYS' || sessionStorageData?.td_submission_type === 'TLV_AND_CREDIT_DAYS') && (
                            <div>
                                <label className="formLabelTx">Bill To:</label>
                                <Select
                                    isSearchable={true}
                                    value={detailsData?.billTo}
                                    options={selectBoxData?.billTo.map((d: any) => ({ value: d.bill_to, label: d.bill_to_name }))}
                                    isDisabled={pageType === 'View'}
                                    onChange={(event) => {
                                        setDetailsData((pre: any) => ({
                                            ...pre, billTo: event
                                        }))
                                    }}
                                />
                            </div>
                        )}

                        {(sessionStorageData?.td_submission_type === 'CREDIT_DAYS' || sessionStorageData?.td_submission_type === 'TLV_AND_CREDIT_DAYS') && (
                            <div>
                                {selectBoxData?.customerAndPaymentType.length > 0 && selectBoxData?.customerAndPaymentType.map((item: any, index: React.Key | null | undefined) => (
                                    <div key={index}>
                                        <span className="mt-2 block">Customer Type: {item.dlr_cust_type}</span>
                                        <span className="mt-1 block">Payment Type: {item.dlr_payment_term}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div>
                            <label className="formLabelTx">Upload relevant document as proof of increase in TLV:</label>
                            <input
                                type="file"
                                onChange={(event) => {
                                    imageChange(event, 'TLV DOC');
                                }}
                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp"
                            />
                        </div>

                        {detailsData?.file_doc && (
                            <div className='mt-6'>
                                <button onClick={(event) => handleDownload(event, detailsData?.table[0]?.file_doc)}>
                                    <FaDownload />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* GO button */}
                    <div className="m-5 flex items-center justify-center">
                        <Button
                            className="btn btn-info w-40 rounded-full"
                            variant="filled"
                            onClick={() => {
                                setDetailsData({ auto_id: 0, depot: detailsData?.depot, territory: detailsData?.territory, dealer: detailsData?.dealer, billTo: detailsData?.billTo, file_doc: detailsData?.file_doc, keyParam: [], outstanding: [] });
                                GetTLVDetailsData({
                                    auto_id: detailsData.auto_id || 0,
                                    depot_code: detailsData.depot?.value || '',
                                    dlr_bill_to: detailsData.billTo?.value || '',
                                    dlr_dealer_code: detailsData.dealer?.value || '',
                                    td_submission_type: sessionStorageData?.td_submission_type || ''
                                });
                                GetCustomerAndPaymentType({ DepotCode: detailsData.depot?.value, BillToCode: detailsData.billTo?.value });
                            }}
                        >
                            <span style={{ color: 'rgba(255,255,255,0.6)' }}>Go</span>
                        </Button>
                    </div>

                    {/* accordians */}
                    {getTlvDetailsCalled &&
                        <div className="space-y-2 font-semibold">
                            {/* Aadhar Info accordian */}
                            <div className="rounded border border-[#d3d3d3] dar k:border-[#1b2e4b]">
                                <button type="button" className={'custAccoHead flex w-full items-center px-3 py-2 text-white-dark dark:bg-[#1b2e4b] '} onClick={() => setAccordianOpen(accordianOpen === '1' ? '' : '1')}>
                                    Aadhar Info (Optional)
                                    <div className={`${'ltr:ml-auto rtl:mr-auto'}${accordianOpen === '1' ? ' rotate-180' : ''}`}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 9L12 15L5 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                    </div>
                                </button>
                                <div>
                                    <AnimateHeight duration={300} height={accordianOpen === '1' ? 'auto' : 0}>
                                        <div className="bg-white rounded-lg px-4 py-1 shadow-md mb-2">
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
                                                <div>
                                                    <label className="block text-sm font-semibold mb-1">Aadhar No.:</label>
                                                    <input
                                                        type="text"
                                                        autoComplete="off"
                                                        placeholder="Aadhar No."
                                                        className="w-full border rounded form-input text-sm"
                                                        name="aadhar_no"
                                                        value={detailsData.aadhar_no || ''}
                                                        onChange={(e) => {
                                                            const value = e.target.value.replace(/[^0-9]/g, '');
                                                            if (value.length <= 12) {
                                                                setDetailsData((pre: any) => ({
                                                                    ...pre, aadhar_no: value
                                                                }))
                                                            }
                                                        }}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold mb-1">Name as in Addhar:</label>
                                                    <input
                                                        type="text"
                                                        autoComplete="off"
                                                        placeholder="Name as in Addhar"
                                                        className="w-full border rounded form-input text-sm"
                                                        name="full_name"
                                                        value={detailsData.full_name || ''}
                                                        onChange={(e) => setDetailsData((pre: any) => ({
                                                            ...pre, full_name: e.target.value
                                                        }))}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold mb-1">Upload Aadhar:</label>
                                                    <input
                                                        // className="w-full border rounded form-input text-sm"
                                                        type="file"
                                                        onChange={(event) => {
                                                            imageChange(event, 'AADHAR DOC');
                                                        }}
                                                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp"
                                                    />
                                                </div>

                                                {detailsData?.aadhar_doc && (
                                                    <div className='mt-6'>
                                                        <button onClick={(event) => handleDownload(event, detailsData?.aadhar_doc)}>
                                                            <FaDownload />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </AnimateHeight>
                                </div>
                            </div>

                            {/* PAN Info accordian */}
                            <div className="rounded border border-[#d3d3d3] dark:border-[#1b2e4b]">
                                <button type="button" className={`custAccoHead flex w-full items-center px-3 py-2 text-white-dark dark:bg-[#1b2e4b] `} onClick={() => setAccordianOpen(accordianOpen === '2' ? '' : '2')}>
                                    PAN Info (Optional)
                                    <div className={`${'ltr:ml-auto rtl:mr-auto'}${accordianOpen === '2' ? ' rotate-180' : ''}`}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 9L12 15L5 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                    </div>
                                </button>
                                <div>
                                    <AnimateHeight duration={300} height={accordianOpen === '2' ? 'auto' : 0}>
                                        <div className="bg-white rounded-lg px-4 py-1 shadow-md mb-2">
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
                                                <div>
                                                    <label className="block text-sm font-semibold mb-1">PAN:</label>
                                                    <input
                                                        autoComplete="off"
                                                        type="text"
                                                        placeholder="PAN"
                                                        className="w-full border rounded form-input text-sm"
                                                        name="pan_no"
                                                        value={detailsData.pan_no || ''}
                                                        onChange={(e) => setDetailsData((pre: any) => ({
                                                            ...pre, pan_no: e.target.value
                                                        }))}
                                                        maxLength={10}
                                                        minLength={10}
                                                    />
                                                </div>

                                                {/* <div>
                                                    <label className="block text-sm font-semibold mb-1">Name as in PAN:</label>
                                                    <input
                                                        type="text"
                                                        autoComplete="off"
                                                        placeholder="Name as in PAN"
                                                        className="w-full border rounded form-input text-sm"
                                                        name="holderName"
                                                        value={detailsData.holderName || ''}
                                                        onChange={(e) => setDetailsData((pre: any) => ({
                                                            ...pre, holderName: e.target.value
                                                        }))}
                                                    />
                                                </div> */}

                                                <div>
                                                    <label className="block text-sm font-semibold mb-1">Upload PAN:</label>
                                                    <input
                                                        // className="fileTypeInput form-input"
                                                        type="file"
                                                        onChange={(event) => {
                                                            imageChange(event, 'PAN DOC');
                                                        }}
                                                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp"
                                                    />
                                                </div>

                                                {detailsData?.pan_doc && (
                                                    <div className='mt-6'>
                                                        <button onClick={(event) => handleDownload(event, detailsData?.pan_doc)}>
                                                            <FaDownload />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </AnimateHeight>
                                </div>
                            </div>

                            {/* LC/BG accordian */}
                            <div className="rounded border border-[#d3d3d3] dark:border-[#1b2e4b]">
                                <button type="button" className={`custAccoHead flex w-full items-center px-3 py-2 text-white-dark dark:bg-[#1b2e4b]`} onClick={() => setAccordianOpen(accordianOpen === '3' ? '' : '3')}>
                                    LC/BG ({detailsData?.lcbg_mandatory_yn === 'Y' ? 'Required' : 'Optional'}) and Cheque Info ({detailsData?.lcbg_mandatory_yn === 'Y' ? 'Required' : 'Optional'})
                                    <div className={`ltr:ml-auto rtl:mr-auto ${accordianOpen === '3' ? 'rotate-180' : ''}`}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 9L12 15L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                    </div>
                                </button>
                                <div>
                                    <AnimateHeight duration={300} height={accordianOpen === '3' ? 'auto' : 0}>
                                        <div className="border-t border-[#d3d3d3] p-1 text-[13px] dark:border-[#1b2e4b]">
                                            <div className="mb-4 border-b border-[#d3d3d3] pb-4">
                                                <div className="flex items-center">
                                                    <label className="formLabelTx mr-2">
                                                        Enable LC/BG Fields: {detailsData?.lcbg_mandatory_yn === 'Y' ? 'Required' : 'Optional'}
                                                    </label>
                                                    <select disabled={detailsData?.lcbg_mandatory_yn === 'Y'} value={detailsData?.lcbg_appl_yn} onChange={(e) => setDetailsData((pre: any) => ({ ...pre, lcbg_appl_yn: e.target.value }))} className="yesNoTogal form-input ml-2">
                                                        <option value="Y">Yes</option>
                                                        <option value="N">No</option>
                                                    </select>
                                                </div>

                                                {detailsData?.lcbg_mandatory_yn === 'Y' && (
                                                    <div className="bg-white rounded-lg px-4 py-1 shadow-md mb-2">
                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
                                                            <div>
                                                                <label className="block text-sm font-semibold mb-1">
                                                                    LC/BG Opening Date:<span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                                                </label>
                                                                <Flatpickr
                                                                    className="w-full border rounded form-input text-sm"
                                                                    options={{
                                                                        dateFormat: 'Y-m-d', // Actual input value format (ISO format)
                                                                        altInput: true, // Enables alternative display input
                                                                        altFormat: 'd/m/Y', // Display format for the user
                                                                    }}
                                                                    value={detailsData.lcbg_opening_date ? convertToDate(detailsData.lcbg_opening_date) : ''}
                                                                    onChange={(date) => setDetailsData((pre: any) => ({ ...pre, lcbg_opening_date: date[0] }))}
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-semibold mb-1">
                                                                    LC/BG Expiry Date:<span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                                                </label>
                                                                <Flatpickr
                                                                    className="w-full border rounded form-input text-sm"
                                                                    options={{
                                                                        dateFormat: 'd/m/Y',
                                                                        position: 'auto left',
                                                                        // disable: [(date) => isDateDisabled(date)],
                                                                    }}
                                                                    value={detailsData.lcbg_expiry_date ? convertToDate(detailsData.lcbg_expiry_date) : ''}
                                                                    onChange={(date) => setDetailsData((pre: any) => ({ ...pre, lcbg_expiry_date: date[0] }))}
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-semibold mb-1">
                                                                    LC/BG Amount (Lakhs):<span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="LC/BG Amount"
                                                                    className="w-full border rounded form-input text-sm"
                                                                    name="lcbg_amount"
                                                                    value={detailsData.lcbg_amount || ''}
                                                                    onChange={(e) => setDetailsData((pre: any) => ({ ...pre, lcbg_amount: e.target.value }))}
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-semibold mb-1">
                                                                    LC/BG Copy:<span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                                                </label>
                                                                <input
                                                                    // className="fileTypeInput form-input"
                                                                    type="file"
                                                                    onChange={(event) => {
                                                                        imageChange(event, 'LCBG DOC');
                                                                    }}
                                                                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp"
                                                                />
                                                            </div>

                                                            {detailsData?.lcbg_doc && (
                                                                <div className='mt-6'>
                                                                    <button onClick={(event) => handleDownload(event, detailsData?.lcbg_doc)}>
                                                                        <FaDownload />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="">
                                                <div className="mb-2 flex items-center">
                                                    <label className="formLabelTx mr-2">
                                                        Enable Blank Cheque Fields: {detailsData?.blank_chq_mandatory_yn === 'Y' ? 'Required' : 'Optional'}
                                                    </label>
                                                    <select disabled={detailsData?.blank_chq_mandatory_yn === 'Y'} value={detailsData.chq_appl_yn} onChange={(e) => setDetailsData((pre: any) => ({ ...pre, chq_appl_yn: e.target.value }))} className="yesNoTogal form-input ml-2">
                                                        <option value="Y">Yes</option>
                                                        <option value="N">No</option>
                                                    </select>
                                                </div>

                                                {detailsData.chq_appl_yn === 'Y' && (
                                                    <div className="bg-white rounded-lg px-4 py-1 shadow-md mb-2">
                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
                                                            <div>
                                                                <label className="block text-sm font-semibold mb-1">
                                                                    Cheque No.:<span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="td_blank_chq_no"
                                                                    className="w-full border rounded form-input text-sm"
                                                                    maxLength={10}
                                                                    minLength={6}
                                                                    value={detailsData.td_blank_chq_no || ''}
                                                                    onChange={(e) => setDetailsData((pre: any) => ({ ...pre, td_blank_chq_no: e.target.value }))}
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-semibold mb-1">
                                                                    IFSC:<span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    autoComplete="off"
                                                                    name="td_ifsc_code"
                                                                    className="w-full border rounded form-input text-sm"
                                                                    value={detailsData.td_ifsc_code || ''}
                                                                    onChange={(e) => setDetailsData((pre: any) => ({ ...pre, td_ifsc_code: e.target.value }))}
                                                                />
                                                                <div className={`mt-2 text-sm ${detailsData?.success ? 'text-green-500' : 'text-red-500'}`}>
                                                                    {detailsData?.message && <span>{detailsData?.message}</span>}
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-semibold mb-1">
                                                                    Bank Name:<span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="bankName"
                                                                    value={detailsData.bankName}
                                                                    className="w-full border rounded form-input text-sm"
                                                                    readOnly
                                                                    style={{ cursor: 'not-allowed', backgroundColor: '#f0f0f0' }}
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-semibold mb-1">
                                                                    Branch:<span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="branch"
                                                                    value={detailsData.branch}
                                                                    className="w-full border rounded form-input text-sm"
                                                                    readOnly
                                                                    style={{ cursor: 'not-allowed', backgroundColor: '#f0f0f0' }}
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-semibold mb-1">
                                                                    Upload Blank Cheque:<span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                                                </label>
                                                                <input
                                                                    // className="fileTypeInput form-input"
                                                                    type="file"
                                                                    onChange={(event) => {
                                                                        imageChange(event, 'CHEQUE DOC');
                                                                    }}
                                                                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp"
                                                                />
                                                            </div>

                                                            {detailsData?.td_blank_chq_doc && (
                                                                <div className='mt-6'>
                                                                    <button onClick={(event) => handleDownload(event, detailsData?.td_blank_chq_doc)}>
                                                                        <FaDownload />
                                                                    </button>
                                                                </div>
                                                            )}
                                                            <div>
                                                                <Button
                                                                    className={`ml-2000 mt-4 rounded px-4 py-2 font-bold text-white ${detailsData.td_blank_chq_no === '' || detailsData.td_ifsc_code === '' ? 'bg-lightblue cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'
                                                                        }`}
                                                                    onClick={() => handleIFSCValidate()}
                                                                    disabled={detailsData.td_blank_chq_no === '' || detailsData.td_ifsc_code === ''}
                                                                >
                                                                    Validate
                                                                    {/* 397788000234  Deepak  BNZPM2501F   D MANIKANDAN   1234567890    HDFC0000003 */}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </AnimateHeight>
                                </div>
                            </div>
                        </div>
                    }
                </form>
            </div>

            {getTlvDetailsCalled &&
                <>
                    <div>
                        <div className="bg-white rounded-lg px-4 py-1 shadow-md mb-2">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
                                {sessionStorageData?.td_submission_type === 'CREDIT_DAYS' || sessionStorageData?.td_submission_type === 'TLV_AND_CREDIT_DAYS' ? (
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">
                                            Credit Days:<span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            className="w-full border rounded form-input text-sm"
                                            name="dlr_due_days"
                                            readOnly
                                            style={{ cursor: 'not-allowed', backgroundColor: '#f0f0f0' }}
                                            value={detailsData?.dlr_due_days || null}
                                        // onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        //     const target = e.target as HTMLInputElement;
                                        //     target.value = target.value.replace(/[^0-9.]/g, '');
                                        // }}
                                        />
                                    </div>
                                ) : null}

                                <div>
                                    <label className="block text-sm font-semibold mb-1">
                                        Current TLV (Lakhs):<span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="0.00"
                                        className="w-full border rounded form-input text-sm"
                                        name="dlr_credit_limit"
                                        readOnly
                                        style={{ cursor: 'not-allowed', backgroundColor: '#f0f0f0' }}
                                        value={detailsData?.dlr_credit_limit || null}
                                    // onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    //     const target = e.target as HTMLInputElement;
                                    //     target.value = target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\..*/g, '$1');
                                    // }}
                                    />
                                </div>

                                {sessionStorageData?.td_submission_type === 'CREDIT_DAYS' || sessionStorageData?.td_submission_type === 'TLV_AND_CREDIT_DAYS' ? (
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">
                                            Proposed Credit Days:<span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Proposed Cr Days:"
                                            className="w-full border rounded form-input text-sm"
                                            name="proposed_cr_days"
                                            readOnly={detailsData?.editable_yn === 'N'}
                                            value={detailsData.proposed_cr_days || ''}
                                            onChange={(e) => setDetailsData((pre: any) => ({ ...pre, proposed_cr_days: e.target.value }))}
                                            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const target = e.target as HTMLInputElement;
                                                target.value = target.value.replace(/[^0-9]/g, '');
                                            }}
                                        />
                                    </div>
                                ) : null}

                                {sessionStorageData?.td_submission_type === 'TLV' || sessionStorageData?.td_submission_type === 'TLV_AND_CREDIT_DAYS' ? (
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">
                                            Requested TLV (Lakhs):<span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Requested TLV (Lakhs)"
                                            className="w-full border rounded form-input text-sm"
                                            name="proposed_tlv"
                                            readOnly={detailsData?.editable_yn === 'N'}
                                            value={detailsData.proposed_tlv || ''}
                                            onChange={(e) => setDetailsData((pre: any) => ({ ...pre, proposed_tlv: e.target.value }))}
                                            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const target = e.target as HTMLInputElement;
                                                target.value = target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\..*/g, '$1');
                                            }}
                                        />
                                    </div>
                                ) : null}

                                <div>
                                    <label className="block text-sm font-semibold mb-1">
                                        Order to be Billed Volume (KL):<span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Order to be Billed Volume (KL)"
                                        className="w-full border rounded form-input text-sm"
                                        name="order_vol"
                                        readOnly={detailsData?.editable_yn === 'N'}
                                        value={detailsData.order_vol || ''}
                                        onChange={(e) => setDetailsData((pre: any) => ({ ...pre, order_vol: e.target.value }))}
                                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const target = e.target as HTMLInputElement;
                                            target.value = target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\..*/g, '$1');
                                        }}
                                    // disabled={isBilledVolLocked}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1">
                                        Order to be Billed Value (Lakhs):<span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Order to be Billed Value (Lakhs)"
                                        className="w-full border rounded form-input text-sm"
                                        name="order_val"
                                        readOnly={detailsData?.editable_yn === 'N'}
                                        value={detailsData.order_val || ''}
                                        onChange={(e) => setDetailsData((pre: any) => ({ ...pre, order_val: e.target.value }))}
                                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const target = e.target as HTMLInputElement;
                                            target.value = target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\..*/g, '$1');
                                        }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1">
                                        Reason for Increase:<span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Reason for Increase"
                                        className="w-full border rounded form-input text-sm"
                                        name="increase_reason"
                                        readOnly={detailsData?.editable_yn === 'N'}
                                        value={detailsData.increase_reason}
                                        onChange={(e) => setDetailsData((pre: any) => ({ ...pre, increase_reason: e.target.value }))}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1">
                                        End Customer Name:<span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                                    </label>
                                    <input
                                        autoComplete="off"
                                        type="text"
                                        placeholder="End Customer Name"
                                        className="w-full border rounded form-input text-sm"
                                        name="customer_name"
                                        readOnly={detailsData?.editable_yn === 'N'}
                                        value={detailsData.customer_name}
                                        onChange={(e) => setDetailsData((pre: any) => ({ ...pre, customer_name: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Key Parameters-Account Level(Last 1Yr) & Outstanding Details */}
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <div className="panel mb-4">
                                <table className="custTableView lg-custTableView w-full border-collapse">
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: 'center' }} colSpan={2}>
                                                Key Parameters-Account Level(Last 1Yr)
                                            </th>
                                        </tr>
                                        <tr>
                                            <th style={{ width: '70%', textAlign: 'left' }}>Parameter</th>
                                            <th style={{ width: '30%', textAlign: 'center' }}>Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {detailsData?.keyParam.length > 0 && detailsData?.keyParam.map((item: any, itemindexCount: React.Key | null | undefined) =>
                                            <tr key={itemindexCount}>
                                                <td className="border-t px-4 py-2" style={{ width: '70%', textAlign: 'left' }}>
                                                    {item.trd_descr !== null ? item.trd_descr : '-'}
                                                </td>
                                                <td className="border-t px-4 py-2" style={{ width: '30%', textAlign: 'center' }}>
                                                    {item.trd_value !== null ? item.trd_value : '-'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="panel mb-4">
                                <div className="table-responsive">
                                    <table className="custTableView wrap w-full border-collapse">
                                        <thead>
                                            <tr>
                                                <th style={{ textAlign: 'center' }} colSpan={5}>
                                                    Outstanding Details
                                                </th>
                                            </tr>
                                            <tr>
                                                <th style={{ width: '15%', textAlign: 'center' }}>Slab</th>
                                                <th style={{ width: '15%', textAlign: 'center' }}>O/S (Lakhs)</th>
                                                <th style={{ width: '25%', textAlign: 'center' }}>OD (Over-Due Or Due Beyond Credit Days)</th>
                                                <th style={{ width: '25%', textAlign: 'center' }}>Expected Collection Date</th>
                                                <th style={{ width: '20%', textAlign: 'center' }}>Expected Collection Amount (Lakhs)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {detailsData?.outstanding.length > 0 &&
                                                detailsData?.outstanding.map((item: { slab: string; od: any; os: any }, itemindexCount: number) => {
                                                    if (item.slab === 'Total' || !item.slab) return null;
                                                    const showDynamicFields = item.od !== null && item.od > 0;
                                                    const uniqueId = `${itemindexCount + 1}`;
                                                    const collection_date = `collection${uniqueId}_date`;
                                                    const collectionAmount = `collectionAmount${uniqueId}`;
                                                    return (
                                                        <tr key={uniqueId} style={{ backgroundColor: showDynamicFields ? '#ffd9d5' : '' }}>
                                                            <td className="border-t px-4 py-2" style={{ width: '15%', textAlign: 'center' }}>
                                                                {item.slab || '-'}
                                                            </td>
                                                            <td className="border-t px-4 py-2" style={{ width: '15%', textAlign: 'center' }}>
                                                                {item.os !== null ? item.os : '-'}
                                                            </td>
                                                            <td className="border-t px-4 py-2" style={{ width: '20%', textAlign: 'center' }}>
                                                                {item.od !== null ? item.od : '-'}
                                                            </td>
                                                            {showDynamicFields && (
                                                                <>
                                                                    <td style={{ width: '20%', textAlign: 'center' }}>
                                                                        <Flatpickr
                                                                            value={detailsData[collection_date] || ''}
                                                                            options={{ dateFormat: 'd/m/Y', position: 'auto left' }}
                                                                            className="form-input"
                                                                            placeholder="Expected Date"
                                                                            onChange={(date) => setDetailsData((pre: any) => ({ ...pre, [collection_date]: date[0] }))}
                                                                            id={collection_date}
                                                                        />
                                                                    </td>

                                                                    <td style={{ textAlign: 'center' }}>
                                                                        <input
                                                                            type="text"
                                                                            autoComplete="off"
                                                                            placeholder="Value (in Lakhs)"
                                                                            className="form-input"
                                                                            name={collectionAmount}
                                                                            value={detailsData[collectionAmount] || ''}
                                                                            onChange={(e) => setDetailsData((pre: any) => ({ ...pre, [collectionAmount]: e.target.value }))}
                                                                            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                                const target = e.target as HTMLInputElement;
                                                                                target.value = target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\..*/g, '$1');
                                                                            }}
                                                                            id={collectionAmount}
                                                                        />
                                                                    </td>
                                                                </>
                                                            )}
                                                        </tr>
                                                    );
                                                })
                                            }
                                        </tbody>
                                        <tfoot>
                                            {detailsData?.outstanding.length > 0 && detailsData?.outstanding.map((item: { slab: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined; os: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined; od: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined; }, index: React.Key | null | undefined) =>
                                                item.slab === 'Total' && <tr key={index}>
                                                    <td className="border-t px-4 py-2" style={{ width: '15%', textAlign: 'center' }}>
                                                        {item.slab}
                                                    </td>
                                                    <td className="border-t px-4 py-2" style={{ width: '15%', textAlign: 'center' }}>
                                                        {item.os !== null ? item.os : '-'}
                                                    </td>
                                                    <td className="border-t px-4 py-2" style={{ width: '20%', textAlign: 'center' }}>
                                                        {item.od !== null ? item.od : '-'}
                                                    </td>
                                                    <td style={{ width: '20%', textAlign: 'center' }}></td>
                                                    <td style={{ textAlign: 'center' }}></td>
                                                </tr>
                                            )}
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* {(!detailsData?.editable_yn) || (detailsData?.editable_yn && detailsData?.editable_yn !== 'N')  && */}
                    {/* {console.log("detailsData")} */}
                    {detailsData?.editable_yn !== 'N' &&
                        <div className="flex items-center justify-center gap-1 pb-3">
                            <button
                                type="button"
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm flex items-center"
                                onClick={() => {
                                    handleFormSubmit();
                                }}
                            >
                                <IoMdSave /> &nbsp; {pageType === 'View' ? 'Update' : 'Submit'}
                            </button>
                            <button
                                type="button"
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm flex items-center"
                                onClick={() => {
                                    handleBackButton();
                                }}
                            >
                                <IoReturnUpBack />  &nbsp; Back
                            </button>
                        </div>
                    }
                </>
            }

            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
                    <div role="status" className="animate-spin">
                        <svg aria-hidden="true" className="h-8 w-8 fill-blue-600 text-gray-200" viewBox="0 0 100 101" fill="none">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                            />
                        </svg>
                        <span className="sr-only text-white">Please Wait...</span>
                    </div>
                </div>
            )}
        </>
    )
}

export default TLVRevisionRequestDetails