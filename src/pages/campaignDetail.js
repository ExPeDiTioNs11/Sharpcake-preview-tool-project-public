import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import NavbarLogined from '../components/NavbarLogined';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import axios from 'axios';
import transparent_button_whiteText from '../styles/transparent_button_whiteText';
import red_button from '../styles/red_button';
import black_button from '../styles/black_button';
import repeatIcon from '../assets/images/repeat.png';
import shareIcon from '../assets/images/share.png';
import DeleteIcon from '@mui/icons-material/Delete';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Tooltip from '@mui/material/Tooltip';
import { TextField, colors } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteCategoryDialog from './../components/DeleteCategoryDialog';
import DeleteFileDialog from './../components/DeleteFileDialog';
import DeleteSubCategoryDialog from './../components/DeleteSubCategoryDialog';
import LoadingAnimation from './../components/LoadingAnimation';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import uploadVideoImg from './../assets/images/uploadVideo.png'
import uploadBannerImg from './../assets/images/uploadBanner.png'
import uploadStoryboardImg from './../assets/images/uploadStoryboard.png'
import './../disableConsole'
import Box from '@mui/material/Box';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DownloadIcon from '@mui/icons-material/Download';
import LinearProgress from '@mui/material/LinearProgress';

export default function CampaignDetail() {
  const [selectedOption, setSelectedOption] = useState('');
  const [activeTab, setActiveTab] = useState(localStorage.getItem('activeTab') || 'Banner'); // localStorage'den activeTab değerini al, yoksa 'Video' kullan
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  // zoom modal varaible's
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [data, setData] = useState(null);
  const [brand_id, setBrandId] = useState(null);
  const [campaignName, setCampaignName] = useState(null);
  let { id } = useParams();
  const [accordionContent, setAccordionContent] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFileDeleteDialogOpen, setIsFileDeleteDialogOpen] = useState(false);
  const [isDeleteSubCategoryDialogOpen, setIsDeleteSubCategoryDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedFilePath, setSelectedFilePath] = useState(null);
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [selectedView, setSelectedView] = useState('list'); // 'list' veya 'grid'
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState('Download All');
  const [filePathDescResponse, setFilePathDescResponse] = useState(null);

  const [fileTextValues, setFileTextValues] = useState([]);
  const [clickedTextarea, setClickedTextarea] = useState(null);
  const [clickedDesc, setClickedDesc] = useState('');

  const handleFocus = (textareaIndex) => {
    setClickedTextarea(textareaIndex);
    setClickedDesc(fileTextValues[clickedTextarea]?.[textareaIndex] || fileTextValues[0]?.[textareaIndex]);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  }

  const handleInputBlur = () => {
    setIsInputFocused(false);
  }

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : null);
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  }

  const sendCategoryRequest = async (category_id) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios({
        method: 'GET',
        url: `https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/category/get-by-categoryInSubCategories/${category_id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseTwo = await axios({
        method: 'GET',
        url: `https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/category/get-by-categoryID/${category_id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('------------------')
      console.log(responseTwo)



      const categoryData = responseTwo.data.category.map(category => ({
        filePath: category.filePath,
        fileType: category.fileType
      }));

      setfileInfos(responseTwo.data.fileInfos);

      setCategoryResponse(categoryData)

      const subCategoryData = response.data.subCategories.map(subCategory => ({
        _id: subCategory._id,
        subCategoryName: subCategory.subCategoryName
      }));
      setAccordionContent(subCategoryData);
      setSelectedCategoryId(category_id);
      setSelectedSubCategoryId(null)

    } catch (error) {
      alert(error)
      console.error(error);
    }
  };

  


  useEffect(() => {
    const makeApiRequest = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios({
          method: 'GET',
          url: `https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/campaign/get-by-campaignID/${id}`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.data && response.data.categories) {
          setData(response.data.categories);

          const firstCategory = response.data.categories[0];
          if (firstCategory) {
            setSelectedOption(firstCategory.fileType);
            //setActiveTab(firstCategory.fileType === 'Banner' ? 'Banner' : firstCategory.fileType === 'Video' ? 'Video' : 'Storyboard');
          }
        }

        const campaignData = response.data.campaign;

        if (campaignData) {
          const { brand_id, campaignName } = campaignData;
          setBrandId(brand_id);
          setCampaignName(campaignName);
        }

        if (response.data.companyInformations) {
          localStorage.setItem('brandLogoPath', response.data.companyInformations.imgPath);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const filePathDescRequest = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios({
        method: 'GET',
        url: `https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/category/get-all-filePathDesc/`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data && response.data.filePathDescs) {
        setFilePathDescResponse(response.data.filePathDescs);
      }
    };

    const finalUploadCategory = localStorage.getItem('finalUploadCategory');
    if (finalUploadCategory !== null) {
      setExpandedAccordion(finalUploadCategory);
       sendCategoryRequest(finalUploadCategory); // Eğer bu fonksiyonu çağırmak gerekiyorsa burada çağırabilirsiniz
    }

    makeApiRequest();
    filePathDescRequest();

  }, [id]);

  const handleShareLink = () => {
    // Yeni bir input oluştur
    const input = document.createElement('input');
    // Kopyalamak istediğiniz metni bu input'un value'sine ata
    input.value = window.location.origin + '/share-link/' + id;
    // input'u sayfaya ekleyin (tarayıcıda görünmesine gerek yok)
    document.body.appendChild(input);
    // input'un içeriğini seçin
    input.select();
    // Kullanıcının panosuna kopyalama işlemini gerçekleştirin
    document.execCommand('copy');
    // input'u kaldırın
    document.body.removeChild(input);

    const shareLinkBtn = document.getElementById('shareLinkBtn')
    shareLinkBtn.textContent = 'customer link copied'
  }


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenFileModal = () => {
    setIsFileModalOpen(true);
  };

  const handleCloseFileModal = () => {
    setIsFileModalOpen(false);
  };

  // büyüteç modal funcs
  const handleOpenZoomModal = (filePath) => {
    setIsZoomModalOpen(true);
    setImageSrc(filePath)
  };

  // büyüteç modal funcs
  const handleCloseZoomModal = () => {
    setIsZoomModalOpen(false);
  };





  const handleTabClick = (tabNumber) => {
    localStorage.setItem('activeTab', tabNumber); // activeTab değerini localStorage'e kaydet
    setActiveTab(tabNumber);
  };

  const [subCategoryName, setSubCategoryName] = useState('');


  const handleSaveSubCategory = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const category_id = expandedAccordion; // Kullanıcının açık olarak seçtiği kategorinin ID'si
    const campaign_id = id
    console.log("category id : " + category_id);
    console.log("input verisi : " + subCategoryName)

    try {
      const response = await axios({
        method: 'POST',
        url: 'https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/category/subCategory/create-subCategory',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${accessToken}`
        },
        data: {
          category_id,
          subCategoryName,
          campaign_id
        }
      });

      if (response.data.status === 201) {
        // Başarılı bir şekilde işlem gerçekleştiğinde
        const notifyError = (message) => {
          toast.error(message, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000, // 3 saniye sonra otomatik olarak kapanır
          });
        };

        notifyError();
        window.location.reload(); // Sayfayı yeniden yükle
      } else {
        // Başarısız olduğunda, bildirim gösterme işlemi burada yapılabilir.
        alert("please do not leave empty space")
      }
    } catch (error) {
      // Hata durumunda hata mesajını konsola yazdırabilirsiniz.
      console.error(error);
    }
  }

  const handleSaveFolder = () => {
    const folderName = document.getElementById('folderNameInput').value;

    const accessToken = localStorage.getItem('accessToken');
    const campaign_id = id;

    if (!folderName || folderName == "" || folderName == " ") {
      // alert("Folder name cannot be empty!")
      toast.warning("Folder name cannot be empty!");
    }
    else {
      fetch('https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/category/create-category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          campaign_id,
          categoryName: folderName,
          fileType: selectedOption
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          let activeTab = '';
          // Seçili radio inputun hangisi olduğunu kontrol et
          if (selectedOption === 'Banner') {
            activeTab = 'Banner';
            localStorage.setItem("activeTab", activeTab)
          } else if (selectedOption === 'Video') {
            activeTab = 'Video';
            localStorage.setItem("activeTab", activeTab)
          } else if (selectedOption === 'Storyboard') {
            activeTab = 'Storyboard';
            localStorage.setItem("activeTab", activeTab)
          }
          // setActiveTab ile activeTab değerini güncelle
          setActiveTab(activeTab);
          console.log('API response:', data);
          window.location.reload();


        })
        .catch(error => {
          console.error('Error:', error);
        });
    }

  };

  const [subCategoryResponse, setSubCategoryResponse] = useState(null);

  const [categoryResponse, setCategoryResponse] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [fileInfos, setfileInfos] = useState(null);

  const getSubCategoryById = (subCategoryId) => {
    const accessToken = localStorage.getItem('accessToken');

    const settings = {
      method: 'GET',
      url: `https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/category/subCategory/get-by-subCategoryID/${subCategoryId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    };

    axios(settings)
      .then(response => {
        console.log(response)
        const subCategoryResponseData = response.data.subCategory.map(subCategory => ({
          _id: subCategory._id,
          subCategoryFilePath: subCategory.filePath,
          fileType: subCategory.fileType
        }));
        setSubCategoryResponse(subCategoryResponseData); // Response'u state'e atadık

        setfileInfos(response.data.fileInfos);
      })
      .catch(error => {
        console.error(error);
      });

    setSelectedSubCategoryId(subCategoryId); // Seçilen subCategory'nin ID'sini state'e atar
    setSelectedCategoryId(null);
  };

  const handleOpenDeleteDialog = (categoryId) => {


    const handleAsyncOperation = async () => {
      try {
        setSelectedCategoryId(categoryId)
      } catch (error) {
        toast.error('delete error.')
      }

      handleAsyncOperation();

    }


    //setSelectedCategoryId(categoryId);
    console.log("modal a gelen category id değeri : " + categoryId)
    setIsDeleteDialogOpen(true);
  };

  const handleOpenFileDeleteDialog = (filePath) => {
    setSelectedFilePath(filePath);
    console.log("modal a gelen file path değeri : " + filePath)
    setIsFileDeleteDialogOpen(true);
  };

  const handleCloseFileDeleteDialog = () => {
    setIsFileDeleteDialogOpen(false);
  };

  const handleOpenSubCategoryDeleteDialog = (subCategoryId) => {
    setSelectedSubCategoryId(subCategoryId);
    console.log("modal a gelen sub category id değeri : " + subCategoryId)
    setIsDeleteSubCategoryDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };



  const handleCloseSubCategoryDeleteDialog = () => {
    setIsDeleteSubCategoryDialogOpen(false);
  };


  const handleDeleteSubCategory = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.delete(`https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/category/subCategory/delete-subCategory/${selectedSubCategoryId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        setIsDeleteSubCategoryDialogOpen(false); // Silme işlemi başarılıysa dialog kapanır
        window.location.reload(); // Sayfayı yeniden yükle
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteFile = async () => {

    const accessToken = localStorage.getItem('accessToken');
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", "Bearer " + accessToken);

    const urlencoded = new URLSearchParams();
    urlencoded.append("filePath", selectedFilePath);

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow"
    };

    fetch("https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/category/deleteFile", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          window.location.reload();
        }
        else {
          alert('delete error')
        }
      })
      .catch((error) => console.error(error));
  };

  const handleDeleteCategory = async () => {
    alert(selectedCategoryId)
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.delete(`https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/category/delete-category/${selectedCategoryId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        setIsDeleteDialogOpen(false); // Silme işlemi başarılıysa dialog kapanır
        window.location.reload(); // Sayfayı yeniden yükle
      }
    } catch (error) {
      console.error(error);
    }


  };

  const [draggedFile, setDraggedFile] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);


  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setDraggedFile(file);
    setIsPreviewVisible(true);

    // Dosyayı yüklemek için handleUploadFiles işlevini çağırın
    handleUploadFiles([file]); // Sürüklenen dosyayı bir dizi içine alarak çağırın
  };


  const handleFileSelect = (e) => {
    const files = e.target.files;
    setSelectedFiles([...selectedFiles, ...files]);
    if (files && files.length > 0) {
      const selectedFiles = Array.from(files); // Dosyaları diziye dönüştür
      const firstFile = selectedFiles[0]; // İlk dosyayı seçili dosya olarak kullanabilirsiniz

      // Örneğin, ilk dosyanın yüklenmesini işleyebilir veya önizleyebilirsiniz

      setDraggedFile(firstFile);
      setIsPreviewVisible(true);




      // Tüm dosyaları yükleme işlevine iletin
      handleUploadFiles(selectedFiles);
    }
  };

  const handleClick = () => {
    // Dosya seçme input'u tetiklenir
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCancelPreview = () => {
    setIsPreviewVisible(false);
    setDraggedFile(null);
  };

  const handleUploadFiles = (selectedFiles) => {
    const formdata = new FormData();

    // Tüm dosyaları FormData'ya ekleyin
    selectedFiles.forEach(file => {
      formdata.append("file", file);
    });

    // Dosya adlarında Türkçe karakter kontrolü yap
    const isTurkishCharacter = (text) => {
      const turkishCharactersRegex = /[ğüşıöçĞÜŞİÖÇ]/i; // Türkçe karakterleri içeren bir regex
      return turkishCharactersRegex.test(text);
    };

    let turkishChar = 0
    // Seçilen dosyaların adlarını kontrol edin
    selectedFiles.forEach(file => {
      if (isTurkishCharacter(file.name)) {
        // Dosya adı Türkçe karakter içeriyorsa işlemi iptal edin ve mesaj gönderin
        console.log('Dosya adında Türkçe karakterler bulunamaz:', file.name);
        // Toast mesajı göndermek için uygun bir yöntem kullanın
        turkishChar++
        toast.error("File names must not contain Turkish characters.");
        return; // İşlemi iptal etmek için döngüden çıkın
      }
    });

    if (turkishChar > 0) {
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
    else {
      const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow"
      };

      fetch("https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/aws-uploadsystem", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (result.success) {
            const fileUrls = result.file_urls; // Yüklenen dosya URL'leri

            // Her dosya URL'si için işlem yapın
            fileUrls.forEach(fileUrl => {
              const accessToken = localStorage.getItem('accessToken');
              const myHeaders = new Headers();
              myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
              myHeaders.append("Authorization", "Bearer " + accessToken);

              const urlencoded = new URLSearchParams();
              urlencoded.append("filePath", fileUrl);

              const requestOptions = {
                method: "PUT",
                headers: myHeaders,
                body: urlencoded,
                redirect: "follow"
              };
              if (!selectedSubCategoryId) {
                fetch("https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/category/add-filePath/" + selectedCategoryId, requestOptions)
                  .then((response) => response.json())
                  .then((result) => {
                    console.log(result);
                    localStorage.setItem('finalUploadCategory', selectedCategoryId)
                    window.location.reload(); // Sayfayı yenileyin veya işlemleri uygun şekilde güncelleyin
                  })
                  .catch((error) => console.error(error));
              }
              else {
                // Dosya URL'sini filePath array'ine eklemek için istek gönderin
                fetch("https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/category/subCategory/add-filePath/" + selectedSubCategoryId, requestOptions)
                  .then((response) => response.json())
                  .then((result) => {
                    console.log(result);
                    window.location.reload(); // Sayfayı yenileyin veya işlemleri uygun şekilde güncelleyin
                  })
                  .catch((error) => console.error(error));
              }

            });
          }
        })
        .catch((error) => console.error(error));
    }



  };


  //download files
  const downloadCampaignFiles = () => {
    setLoading(true);
    setButtonText('Downloading');
    const accessToken = localStorage.getItem('accessToken');
    const campaign_id = id
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + accessToken);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch("https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/category/download-files/" + campaign_id, requestOptions)
      .then((response) => response.blob()) // Blob olarak yanıt almak için
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${campaignName}.zip`;
        document.body.appendChild(link);
        setLoading(false);
        setButtonText('Download All');
        link.click();
      })
      .catch((error) => {
        console.error(error)
        setLoading(false);
        setButtonText('Please try again later.');
      });

  }

  const handleOpenShareLink = (link) => {
    window.open(link, '_blank');
  }



  const handleChange = (index, textareaIndex, value) => {
    const newValues = [...fileTextValues];
    newValues[index] = { ...newValues[index], [textareaIndex]: value };
    setFileTextValues(newValues);

    if (clickedTextarea !== null) {
      setClickedDesc(newValues[index]?.[textareaIndex] || '');
    }
  };

  const handleScrollTo = (index) => {
    const element = document.getElementById(`#file-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };


  const saveStroyboardText = (value, indexValue) => {
    // console.log('------------------------------------------------------------------')
    // console.log('filePath değeri: ' + value + ' - ' + 'indexValue değeri: ' + indexValue + ' - ' + 'clickedTextarea: ' + clickedTextarea + ' - ' + 'desc değeri: ' + clickedDesc)
    // console.log('------------------------------------------------------------------')
    const accessToken = localStorage.getItem('accessToken');
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", "Bearer " + accessToken);
    const finalIndexValue = indexValue + 1
    const urlencoded = new URLSearchParams();
    urlencoded.append("filePath", value); // file path
    urlencoded.append("desc", clickedDesc); // file desc
    urlencoded.append("indexValue", finalIndexValue); // index value for backend

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow"
    };

    fetch("https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/category/file-desc-worker/", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          window.location.reload();
        }
        else {
          toast.warning('You did not enter a description')
        }
      })
      .catch((error) => console.error(error));
  }

  const tabMenuStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    listStyle: 'none',
    padding: '0',
  };

  const tabMenuItemStyle = {
    position: 'relative',
    padding: '10px 20px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    borderRadius: '5px',
    color: '#000'
  };

  const activeLineStyle = {
    position: 'absolute',
    bottom: '0',
    left: '0',
    width: '100%',
    height: '2px',
    background: '#D90E28'
  };

  const accordionStyle = {
    border: 'none',
    boxShadow: 'none',
    borderBottom: '1px solid #ccc',
  };

  const accordionTitleStyle = {
    fontWeight: 'bold',
  };

  const sidebarStyle = {
    width: '350px',
    height: '100vh',
    background: '#ffffff',
    position: 'sticky',
    top: '0', /* Sayfanın üstünden itibaren sabit bir konumda tut */
    float: 'left',

  };

  const headerStyle = {
    padding: '10px',
    // borderBottom: '1px solid #ccc',
    marginBottom: '-30px'
  };

  const subHeaderStyle = {
    fontSize: '14px',
    fontWeight: '300',
  };

  const middleAreaStyle = {
    marginBottom: '20px',
  };

  const footerStyle = {
    width: '90%',
    background: '#ffffff',
    textAlign: 'center',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  const buttonStyle = {
    marginRight: '10px',
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    background: '#fff',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const uploadInformation = {
    fontWeight: 'bold',
    background: '#D90E28',
    borderRadius: '10px',
    color: 'white',
    padding: '6px'
  };

  // list view list
  function switchListView() {
    setSelectedView('list');
    const contentAreaElement = document.getElementById('contentArea');
    contentAreaElement.style.flexDirection = 'column';

  }

  // gird view list
  function switchGridView() {
    setSelectedView('grid');
    const contentAreaElement = document.getElementById('contentArea');
    contentAreaElement.style.flexDirection = 'row';
  }


  function replayVideo(video_id) {
    const video = document.getElementById(video_id)
    // Videoyun currentTime özelliğini sıfırlayarak başlangıç noktasına döndürün
    video.currentTime = 0;
    // Videoyu oynatın
    video.play();
  }




  return (
    <div>
      <NavbarLogined style={{ position: 'fixed', width: '100%' }} />
      <DeleteCategoryDialog
        open={isDeleteDialogOpen}
        handleClose={handleCloseDeleteDialog}
        handleDelete={handleDeleteCategory}
      />

      <DeleteSubCategoryDialog
        open={isDeleteSubCategoryDialogOpen}
        handleClose={handleCloseSubCategoryDeleteDialog}
        handleDelete={handleDeleteSubCategory}
      />

      <DeleteFileDialog
        open={isFileDeleteDialogOpen}
        handleClose={handleCloseFileDeleteDialog}
        handleDelete={handleDeleteFile}
      />

      <div style={sidebarStyle}>
        <div style={headerStyle}>

          <span style={{ float: 'left', padding: '10px' }}> {brand_id ? brand_id : <LoadingAnimation />} </span>
          <br />
          <h1 style={{ padding: '10px' }}>
            {campaignName ? campaignName : ''}
          </h1>

        </div>
        <div style={middleAreaStyle}>
          <ul style={tabMenuStyle}>
            <li key="Video" style={tabMenuItemStyle} onClick={() => handleTabClick('Video')}>
              <b>Video</b>
              {activeTab === 'Video' && <div style={activeLineStyle} />}
            </li>
            <li key="Banner" style={tabMenuItemStyle} onClick={() => handleTabClick('Banner')}>
              <b>Banner</b>
              {activeTab === 'Banner' && <div style={activeLineStyle} />}
            </li>
            <li key="Storyboard" style={tabMenuItemStyle} onClick={() => handleTabClick('Storyboard')}>
              <b>Storyboard</b>
              {activeTab === 'Storyboard' && <div style={activeLineStyle} />}
            </li>
          </ul>
          {data && data.map(category => (
            activeTab === (category.fileType === 'Banner' ? 'Banner' : category.fileType === 'Video' ? 'Video' : 'Storyboard') && (
              <div key={category._id}>
                <Accordion
                  style={accordionStyle}
                  expanded={expandedAccordion === category._id}
                  onChange={handleAccordionChange(category._id)}
                >
                  <AccordionSummary onClick={() => sendCategoryRequest(category._id)} style={{ backgroundColor: 'white', color: 'black' }}>
                    <Typography style={{ ...accordionTitleStyle, fontWeight: 'bold' }}>{category.categoryName} <span>({category && category.filePath ? category.filePath.length : 0})</span></Typography>
                    <Button
                      style={{ color: '#D90E28', opacity: '0.3', marginLeft: 'auto', cursor: 'pointer', marginTop: '-5px' }}
                      onClick={() => handleOpenDeleteDialog(category._id)}
                      onMouseEnter={(e) => e.target.style.opacity = '1'}
                      onMouseLeave={(e) => e.target.style.opacity = '0.3'}
                    >
                      DELETE
                    </Button>
                    <KeyboardArrowDownIcon />
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography style={{ marginTop: '-30px' }}>
                      {selectedCategoryId && (
                        <ul style={{ listStyle: 'none', padding: '0', maxHeight: '200px', overflowY: 'auto' }}>
                          {categoryResponse[0].filePath.map((item, index) => (
                            <li id={item} style={{ fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.3s' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#f2f2f2'} onMouseLeave={(e) => e.target.style.backgroundColor = 'initial'} onClick={() => handleScrollTo(index)}>
                              <span style={{ opacity: '0.6' }}>{item.split('-').slice(-1).join('-')}</span>
                              <Button
                                style={{ color: '#D90E28', opacity: '0.3', marginLeft: '73%', cursor: 'pointer', marginTop: '-45px' }}
                                onClick={() => handleOpenFileDeleteDialog(item)}
                                onMouseEnter={(e) => e.target.style.opacity = '1'}
                                onMouseLeave={(e) => e.target.style.opacity = '0.3'}
                              >
                                DELETE
                              </Button>

                            </li>
                          ))}
                          {/* <li style={{ cursor: 'pointer', color: '#D90E28' }} onClick={handleOpenFileModal}>
                            Add folder
                          </li> */}
                        </ul>
                      )}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </div>
            )
          ))}
        </div>
        <div style={footerStyle}>


          <Button sx={{ ...red_button, border: 'none', padding: '10px', '&:hover': { backgroundColor: 'green', border: 'none' } }} variant="outlined" color="primary" style={buttonStyle} onClick={handleOpenModal}>
            Add
          </Button>
          <br />
          <Button
            id='downloadAllFilesBtn'
            onClick={downloadCampaignFiles}
            sx={{ ...transparent_button_whiteText, padding: '10px', color: 'black', border: 'none', '&:hover': { backgroundColor: 'black', color: 'white', border: 'none' } }}
            variant="contained"
            color="primary"
            style={buttonStyle}
            disabled={loading} // İndirme işlemi devam ederken butonu devre dışı bırak
          >
            {buttonText}

          </Button>

        </div>
        {loading && <LinearProgress sx={{ width: '87%', float: 'center', marginLeft: '10px', marginTop: '-15px', background: '#D90E28', '& .MuiLinearProgress-barColorPrimary': { backgroundColor: 'black' } }} />}
        <div style={{ alignItems: 'center', width: '90%', textAlign: 'center', }}>
          <Button id='shareLinkBtn' onClick={handleShareLink} sx={{ ...transparent_button_whiteText, padding: '10px', color: 'black', border: 'none', width: '97%', marginLeft: '10px', '&:hover': { backgroundColor: 'black', color: 'white', border: 'none' } }} variant="contained" color="primary" style={buttonStyle}>
            Create customer link
          </Button>
        </div>
      </div>
      <br />
      <>
        <Box sx={{
          display: 'inline-block',
          position: 'relative',
          ml: 10,
          '&::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            borderBottom: selectedView === 'list' ? '2px solid red' : 'none',
            transform: selectedView === 'list' ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 0.3s ease-in-out',
          }
        }}>
          <Button
            id='switchListViewBtn'
            sx={{
              border: 'none',
              backgroundColor: 'transparent',
              color: 'red'
            }}
            color="primary"
            onClick={switchListView}
          >
            Listview
          </Button>
        </Box>
        <Box sx={{
          display: 'inline-block',
          position: 'relative',
          ml: 2,
          '&::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            borderBottom: selectedView === 'grid' ? '2px solid red' : 'none',
            transform: selectedView === 'grid' ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 0.3s ease-in-out',
          }
        }}>
          <Button
            id='switchGirdViewBtn'
            sx={{
              border: 'none',
              backgroundColor: 'transparent',
              color: 'red'
            }}
            color="primary"
            onClick={switchGridView}
          >
            Gridview
          </Button>
        </Box>
      </>
      <div id='contentArea' style={{ backgroundColor: '#f0f0f0', marginLeft: '300px', padding: '20px', display: 'flex', flexDirection: 'column', flexWrap: 'wrap', alignItems: 'center' }}
        onDrop={handleFileDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {selectedCategoryId ? (
          categoryResponse[0].filePath.map((value, index) => {
            const fileInfo = fileInfos[index]; // Dosyanın bilgilerine erişin
            const isVideo = /\.(mp4|webm|ogg)$/i.test(value); // Videonun uzantısını kontrol et 
            const isImage = /\.(jpe?g|png|gif)$/i.test(value); // Resim dosyasının uzantısını kontrol et
            // console.log(fileInfo)
            return (
              <Card id={`#file-${index}`} key={index} style={{ marginBottom: '10px', maxWidth: '100%', minHeight: '400px', marginRight: '10px', flexBasis: 'calc(33.33% - 10px)', backgroundColor: 'transparent', border: 'none' }}>
                  <span style={{ color: 'gray', marginLeft: '10px'}}> {value.split('-').slice(-1).join('-')}  </span>
                <CardContent style={{ width: '500px', height: '300px', overflow: 'hidden' }}>
                  {isVideo ? (
                    <video id={`videoElement${index}`} controls style={{ display: 'block', margin: 'auto', maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }}>
                      <source src={value} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img src={value} alt={`Medya ${index + 1}`} style={{ pointerEvents: 'none', display: 'block', margin: 'auto', maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }} />
                  )}
                  {/* Eğer seçili tab Storyboard ise 3 adet textarea ekle */}
                </CardContent>
                <CardActions>
                  {/* {isVideo && ( // Sadece video dosyaları için baştan oynat butonunu göster
                    <Tooltip title="Play gif or video element from the beginning" arrow>
                      <Button onClick={() => replayVideo(`videoElement${index}`)} style={{ backgroundColor: '#E9E9E9', border: '2px solid #E1E1E1' }} size="small"> <img style={{ width: '20px' }} src={repeatIcon} alt={`Video ${index + 1}`} /></Button>
                    </Tooltip>
                  )} */}

                  {fileInfo && (
                    <Tooltip title={`File information: Type: ${fileInfo.fileType}, Size: ${fileInfo.fileSizeMB} MB, Upload Date: ${fileInfo.uploadDate}`} arrow>
                      <Button style={{ backgroundColor: '#E9E9E9', border: '2px solid #E1E1E1' }} size="small"> <InfoOutlinedIcon style={{ color: '#414141' }} /> </Button>
                    </Tooltip>
                  )}
                  <Tooltip title="Download Video or Image" arrow>
                    <Button
                      style={{ backgroundColor: '#E9E9E9', border: '2px solid #E1E1E1' }}
                      size="small"
                      onClick={() => handleOpenShareLink(value)}
                    >
                      <DownloadIcon style={{ color: '#414141' }} />
                    </Button>

                  </Tooltip>

                  {isVideo ? (
                    <b></b>
                  ) : (
                    <Tooltip title="Zoom in" arrow>
                      <Button onClick={() => handleOpenZoomModal(value)} style={{ backgroundColor: '#E9E9E9', border: '2px solid #E1E1E1' }} size="small"> <ZoomInIcon style={{ color: '#414141' }} /> </Button>
                    </Tooltip>
                  )}

                  <Tooltip title="Delete this file" arrow>
                    <Button onClick={() => handleOpenFileDeleteDialog(value)} style={{ backgroundColor: '#E9E9E9', border: '2px solid #E1E1E1' }} size="small"> <DeleteIcon style={{ color: '#414141' }} /> </Button>
                  </Tooltip>
                </CardActions>
                {categoryResponse[0].fileType === "Storyboard" && (
                  <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                    <div style={{ position: 'relative' }}>
                      <div>
                        {[0, 1, 2].map(textareaIndex => (

                          <div key={textareaIndex}>
                           <b><span style={{ marginLeft: '10px' }}>{textareaIndex === 0 ? `Voice Over` : textareaIndex === 1 ? `Super` : `Description`}</span></b>
                            <textarea
                              rows="4"
                              cols="50"
                              placeholder={
                                filePathDescResponse.find(item => item.filePath === value)?.desc[textareaIndex] || ''
                              }
                              value={fileTextValues[index]?.[textareaIndex]}
                              onChange={(e) => handleChange(index, textareaIndex, e.target.value)}
                              onFocus={() => handleFocus(textareaIndex)}
                              style={{
                                width: '90%',
                                marginLeft: '2%',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                borderLeft: `8px solid ${textareaIndex === 0 ? '#19ABD2' : textareaIndex === 1 ? '#D90E28' : '#ACACAC'}`,
                                padding: '10px',
                                marginBottom: '10px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                transition: 'box-shadow 0.3s',
                                resize: 'none',
                                outline: 'none',
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      {/* buradaki value filePath değerini içerir. 1 ise indexValue değeridir. */}
                      <Button sx={{ border: 'none', marginTop: '-20px', '&:hover': { border: 'none', color: 'black', padding: '-10px' } }} variant="outlined" color="primary" style={buttonStyle} onClick={() => saveStroyboardText(value, clickedTextarea)}>
                        save changes
                      </Button>
                      {/* <Button sx={{ border: 'none', marginTop: '-20px', '&:hover': { border: 'none', color: '#D90E28', padding: '-10px' } }} variant="outlined" color="primary" style={buttonStyle} onClick={handleOpenModal}>
                          Delete this text
                        </Button> */}
                    </div>
                  </div>

                )}
              </Card>
            );
          })
        ) : (

          subCategoryResponse && subCategoryResponse[0].subCategoryFilePath.map((value, index) => {
            const fileInfo = fileInfos[index]; // Dosyanın bilgilerine erişin
            const isVideo = /\.(mp4|webm|ogg)$/i.test(value); // Videonun uzantısını kontrol et 
            const isImage = /\.(jpe?g|png|gif)$/i.test(value); // Resim dosyasının uzantısını kontrol et
            console.log(fileInfo);
            return (
              <Card key={index} style={{ marginBottom: '10px', maxWidth: '500px', minHeight: '400px', marginRight: '10px', flexBasis: 'calc(33.33% - 10px)', backgroundColor: 'transparent', border: 'none' }}>
                {isVideo ? (
                  <b style={{ color: 'gray', marginLeft: '10px', marginTop: '10px' }}> Video {index + 1} </b>
                ) : (
                  <b style={{ color: 'gray', marginLeft: '10px', marginTop: '10px' }}> Image {index + 1} </b>
                )}

                <CardContent style={{ width: '500px', height: '300px' }}>
                  {isVideo ? (
                    <video id={`videoElement${index}`} controls style={{ display: 'block', margin: 'auto', maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }}>
                      <source src={value} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img src={value} alt={`Medya ${index + 1}`} style={{ display: 'block', margin: 'auto', maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }} />
                  )}

                </CardContent>
                <CardActions>
                  {/* {isVideo && ( // Sadece video dosyaları için baştan oynat butonunu göster
                    <Tooltip title="Play gif or video element from the beginning" arrow>
                      <Button onClick={() => replayVideo(`videoElement${index}`)} style={{ backgroundColor: '#E9E9E9', border: '2px solid #E1E1E1' }} size="small"> <img style={{ width: '20px' }} src={repeatIcon} alt={`Video ${index + 1}`} /></Button>
                    </Tooltip>
                  )} */}

                  {fileInfo && (
                    <Tooltip title={`File information: Type: ${fileInfo.fileType}, Size: ${fileInfo.fileSizeMB} MB, Upload Date: ${fileInfo.uploadDate}`} arrow>
                      <Button style={{ backgroundColor: '#E9E9E9', border: '2px solid #E1E1E1' }} size="small"> <InfoOutlinedIcon style={{ color: '#414141' }} /> </Button>
                    </Tooltip>
                  )}
                  <Tooltip title="Download Video or Image" arrow>
                    <Button
                      style={{ backgroundColor: '#E9E9E9', border: '2px solid #E1E1E1' }}
                      size="small"
                      onClick={() => handleOpenShareLink(value)}
                    >
                      <DownloadIcon style={{ color: '#414141' }} />
                    </Button>
                  </Tooltip>
                  {isVideo ? (
                    <Tooltip title="Zoom in" arrow style={{ display: 'none' }}>
                      <Button onClick={() => handleOpenZoomModal(value)} style={{ backgroundColor: '#E9E9E9', border: '2px solid #E1E1E1' }} size="small"> <ZoomInIcon style={{ color: '#414141' }} /> </Button>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Zoom in" arrow>
                      <Button onClick={() => handleOpenZoomModal(value)} style={{ backgroundColor: '#E9E9E9', border: '2px solid #E1E1E1' }} size="small"> <ZoomInIcon style={{ color: '#414141' }} /> </Button>
                    </Tooltip>
                  )}

                  <Tooltip title="Delete this file" arrow>
                    <Button onClick={() => handleOpenFileDeleteDialog(value)} style={{ backgroundColor: '#E9E9E9', border: '2px solid #E1E1E1' }} size="small"> <DeleteIcon style={{ color: '#414141' }} /> </Button>
                  </Tooltip>
                </CardActions>
                {/* Eğer seçili tab Storyboard ise 3 adet textarea ekle */}

                {subCategoryResponse[0].fileType === 'Storyboard' && (
                  <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                    <div style={{ position: 'relative' }}>
                      <div>
                        {[0, 1, 2].map(textareaIndex => (

                          <div key={textareaIndex}>

                            <textarea
                              rows="4"
                              cols="50"
                              placeholder={
                                filePathDescResponse.find(item => item.filePath === value)?.desc[textareaIndex] || `Text ${textareaIndex + 1}`
                              }
                              value={fileTextValues[index]?.[textareaIndex]}
                              onChange={(e) => handleChange(index, textareaIndex, e.target.value)}
                              onFocus={() => handleFocus(textareaIndex)}
                              style={{
                                width: '90%',
                                marginLeft: '2%',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                borderLeft: `8px solid ${textareaIndex === 0 ? '#19ABD2' : textareaIndex === 1 ? '#D90E28' : '#ACACAC'}`,
                                padding: '10px',
                                marginBottom: '10px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                transition: 'box-shadow 0.3s',
                                resize: 'none',
                                outline: 'none',
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      {/* buradaki value filePath değerini içerir. 1 ise indexValue değeridir. */}
                      <Button sx={{ border: 'none', marginTop: '-20px', '&:hover': { border: 'none', color: 'black', padding: '-10px' } }} variant="outlined" color="primary" style={buttonStyle} onClick={() => saveStroyboardText(value, clickedTextarea)}>
                        save changes
                      </Button>
                      {/* <Button sx={{ border: 'none', marginTop: '-20px', '&:hover': { border: 'none', color: '#D90E28', padding: '-10px' } }} variant="outlined" color="primary" style={buttonStyle} onClick={handleOpenModal}>
                          Delete this text
                        </Button> */}
                    </div>

                  </div>

                )}
              </Card>
            );
          })
        )}









        {/* Gri kart (subcategory için) */}
        {selectedSubCategoryId && (
          <Card style={{ marginBottom: '10px', width: '32%', marginRight: '10px', flexBasis: 'calc(33.33% - 10px)', backgroundColor: 'transparent', border: 'none' }}>
            <CardContent style={{ background: '#ccc', height: '470px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {selectedFiles.map((file, index) => (
                <div key={index}>
                  {file.type.includes('video') ? (
                    <video controls style={{ width: '100%' }}>
                      <source src={URL.createObjectURL(file)} type={file.type} />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img src={URL.createObjectURL(file)} alt={`preview-${index}`} style={{ width: '100%' }} />
                  )}
                </div>
              ))}
              {!selectedFiles.length && !isPreviewVisible && (
                <div style={{ width: '800px', textAlign: 'center', color: '#A3A3A3' }}>
                  <CloudUploadIcon style={{ width: '80px', height: '80px' }} />
                  <br />
                  File drag & drop <br />
                  <input
                    type="file"
                    accept="image/*, video/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    multiple
                  />
                  or
                  <label
                    htmlFor="fileInput"
                    style={{
                      cursor: 'pointer',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      display: 'inline-block',
                    }}
                    onClick={handleClick}
                  >
                    <b>Select File</b>
                  </label>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Gri kart (category için) */}
        {selectedCategoryId && (
          <Card style={{ marginBottom: '10px', width: '32%', marginRight: '10px', flexBasis: 'calc(33.33% - 10px)', backgroundColor: 'transparent', border: 'none' }}>
            <CardContent style={{ background: '#ccc', height: '470px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {selectedFiles.map((file, index) => (
                <div key={index}>
                  {file.type.includes('video') ? (
                    <video controls style={{ width: '100%' }}>
                      <source src={URL.createObjectURL(file)} type={file.type} />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img src={URL.createObjectURL(file)} alt={`preview-${index}`} style={{ width: '100%' }} />
                  )}
                </div>
              ))}
              {!selectedFiles.length && !isPreviewVisible && (
                <div style={{ width: '800px', textAlign: 'center', color: '#A3A3A3' }}>
                  <CloudUploadIcon style={{ width: '80px', height: '80px' }} />

                  <br />
                  File drag & drops <br />
                  <input
                    type="file"
                    accept="image/*, video/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    multiple
                  />
                  or
                  <label
                    htmlFor="fileInput"
                    style={{
                      cursor: 'pointer',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      display: 'inline-block',
                    }}
                    onClick={handleClick}
                  >
                    <b>Select File</b>
                  </label>
                  <label>

                  </label>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {isPreviewVisible && (
          <div>
            <span> <LoadingAnimation /> </span>
          </div>
        )}
      </div>


      {/* büyüteç modal */}

      <Modal open={isZoomModalOpen}
        onClose={handleCloseZoomModal}
      >
        <div style={{ ...modalStyle, width: '50%', height: '50%', borderRadius: '15px', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {imageSrc.endsWith('.mp4') ? (
            <video controls style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%' }}>
              <source src={imageSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={imageSrc} style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '100%' }} alt='original picture' />
          )}
        </div>

      </Modal>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
      >
        <div style={{ ...modalStyle, width: '700px', height: '400px', borderRadius: '15px', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {/* <h2 style={{ margin: '0', marginBottom: '10px' }}>Add Folder</h2> */}
          <h2 style={{ margin: '0', marginBottom: '10px' }}>ADD</h2>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            {[
              { label: 'Banner', value: 'Banner', imgSrc: uploadBannerImg, width: '50px' },
              { label: 'Video', value: 'Video', imgSrc: uploadVideoImg, width: '60px' },
              { label: 'Storyboard', value: 'Storyboard', imgSrc: uploadStoryboardImg, width: '50px' },
            ].map((item) => (
              <div key={item.value} style={{ margin: '10px' }}>
                <label style={{ cursor: 'pointer' }}>
                  <input
                    type="radio"
                    value={item.value}
                    checked={selectedOption === item.value}
                    onChange={() => handleOptionChange({ target: { value: item.value } })}
                    style={{ display: 'none' }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      border: selectedOption === item.value ? '1px solid #D90E28' : '1px solid #ccc',
                      borderRadius: '5px',
                      padding: '10px',
                      borderRadius: '10px'
                    }}
                  >
                    <img src={item.imgSrc} alt={item.label} style={{ width: item.width, height: '50px', marginBottom: '8px' }} />
                    <strong style={{ color: '#000' }}>{item.label}</strong>
                  </div>
                </label>
              </div>
            ))}
          </div>
          <input
            type="text"
            id="folderNameInput"
            placeholder="Folder Name"
            style={{
              width: '60%',
              padding: '10px',
              marginBottom: '10px',
              border: `1px solid ${isInputFocused ? '#D90E28' : '#ccc'}`, // Border rengi dinamik olarak değiştirildi
              borderRadius: '5px',
              margin: '0 auto'
            }}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          <Button variant="contained" color="primary" sx={{ ...black_button, '&:hover': { backgroundColor: '#D90E28', color: 'white', border: 'none' } }} style={{ width: '40%', border: 'none', marginTop: '10px' }} onClick={handleSaveFolder}>
            Save
          </Button>
          <Button style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'absolute', top: '10px', right: '10px' }} onClick={handleCloseModal}>
            <span style={{ color: '#000', fontSize: '24px' }}>×</span>
          </Button>
        </div>
      </Modal>
      <ToastContainer />


      <Modal
        open={isFileModalOpen}
        onClose={handleCloseFileModal}
      >
        <div style={{ ...modalStyle, width: '500px', height: '300px', borderRadius: '15px', border: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h2 style={{ margin: '0', marginLeft: '170px', flexGrow: '1' }}>Add Folder</h2>
            <Button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={handleCloseFileModal}>
              <span style={{ color: '#000', fontSize: '24px' }}>×</span>
            </Button>
          </div>
          <hr style={{ border: '1px solid #000', width: '80%', margin: '0 auto', marginBottom: '10px' }} />
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', marginTop: '50px' }}>
            <TextField
              label="Sub Category Name"
              variant="outlined"
              style={{ marginBottom: '10px', width: '50%' }}
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
            />
            <Button
              sx={{ ...black_button, '&:hover': { backgroundColor: '#D90E28', color: 'white', border: 'none' } }}
              onClick={handleSaveSubCategory}
              variant="contained"
              color="primary"
              style={{ minWidth: '120px', borderRadius: '5px' }} // Set a minimum width for the button
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>


    </div>
  );
}
