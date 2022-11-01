import React, { useEffect, useRef, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from '../Spinner';
import chunk from '../../utilities/chunk';
import GalleryRow from '../Gallery/GalleryRow';
import { DebounceInput } from 'react-debounce-input';
import {
  cateGoryOptions,
  conferenceOptions,
  stateOptions,
  regionOptions,
  divisionOptions,
} from './data';
import SelectDropdown from './SelectDropdown';
import {
  getInterestedUniversities,
  getPublicUniversities,
  getUniversities,
} from '../../network/lib/universities';
import Session from 'supertokens-auth-react/recipe/session';
import { reactQueryKeys } from '../../config/reactQueryKeys';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';

export default function UniversitiesGallery({ _res }) {
  const [hasMore, setHasMore] = useState(true);
  const [loadingUnis, _] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(cateGoryOptions[0]);
  const [selectedConference, setSelectedConference] = useState(
    conferenceOptions[0]
  );
  const [selectedState, setSelectedState] = useState(stateOptions[0]);
  const [selectedRegion, setSelectedRegion] = useState(regionOptions[0]);
  const [selectedDivision, setSelectedDivision] = useState(divisionOptions[0]);
  const [searchNameOrCity, setSearchNameOrCity] = useState('');

  const abortControllerRef = useRef(new AbortController());
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  var mine = !_res; // needs to be var to avoid scope errors

  const searchTerm = JSON.stringify({
    searchNameOrCity: searchNameOrCity,
    selectedState: selectedState.value,
    selectedConference: selectedConference.value,
    selectedDivision: selectedDivision.value,
    selectedRegion: selectedRegion.value,
    selectedCategory: selectedCategory.value,
  });

  // const resetLength =
  //   queryClient.getQueryData([reactQueryKeys.universities, mine, searchTerm])
  //     ?.data.length || 9;
  const getUnisFunction = async (limit, skip, search = '') => {
    const abortControllerRefCurrent = abortControllerRef.current;
    if (!(await Session.doesSessionExist())) {
      return await getPublicUniversities(
        limit,
        abortControllerRefCurrent,
        skip,
        search
      );
    }
    const getUnis = mine ? getInterestedUniversities : getUniversities;
    return await getUnis(limit, abortControllerRefCurrent, skip, search);
  };

  const getRequestLength = () => {
    const currentCacheLength = queryClient.getQueryData([
      reactQueryKeys.universities,
      mine,
      searchTerm,
    ])?.data.length;
    if (currentCacheLength && currentCacheLength >= 9) {
      return currentCacheLength;
    }
    return 9;
  };

  const { data: uniData, isLoading: loading } = useQuery(
    [reactQueryKeys.universities, mine, searchTerm],
    () => {
      // we cannot use resetLength here because it captures the length at render, not in real/current time
      // whereas how we do it below, we compute the values when the function "getRequestLength" is invoked, so we get the most
      // up to date values.
      return getUnisFunction(getRequestLength(), 0, searchTerm);
    },
    {
      onSuccess: async ({ data, status }) => {
        if (status === 200) {
          setAllUnis(data);
          if (data.length === 0) {
            setHasMore(false);
          } else {
            await fetchMoreData();
          }
        } else {
          router.push('/error');
        }
      },
      onError: async () => {
        toast.error('An error occured while retrieving universities', {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      },
    }
  );
  const [allUnis, setAllUnis] = useState(_res?.data || uniData?.data || []);
  const searchedUnis = transformUnis(allUnis);

  // optimistic retrieve - if data in cache, use it. The reason we can't use useQuery to do this for us is because
  // searchTerm in [reactQueryKeys.universities, mine, searchTerm] changes
  useEffect(() => {
    const cachedData = queryClient.getQueryData([
      reactQueryKeys.universities,
      mine,
      searchTerm,
    ])?.data;
    if (cachedData) {
      setAllUnis(cachedData);
      setHasMore(true);
    }
  }, [mine, queryClient, searchTerm]);
  // end optimistic retrieve

  const fetchMoreData = async () => {
    try {
      let res = await getUnisFunction(
        9,
        queryClient.getQueryData([
          reactQueryKeys.universities,
          mine,
          searchTerm,
        ])?.data.length || 9,
        searchTerm
      );
      // unlike the intial fetch, we want to check if there is more data to be fetched. So check < 9, not === 0
      if (res?.data.length < 9) {
        setHasMore(false);
      }
      setAllUnis((prevUnis) => {
        const newAllUnis = [].concat(prevUnis, res.data);
        queryClient.setQueryData(
          [reactQueryKeys.universities, mine, searchTerm],
          (oldQueryObj) => {
            const newQueryObj = { ...oldQueryObj };
            newQueryObj.data = newAllUnis;
            return newQueryObj;
          }
        );
        return newAllUnis;
      });
    } catch (error) {
      toast.error('An error occured while retrieving more universities', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  function transformUnis(unis) {
    return unis.map((uni, index) => {
      let uniObj = {
        ...uni,
        index: index,
        backgroundImage: `/backgrounds/${uni.name}.jpg`,
        blurredBackgroundImage: `/blurredBackgrounds/${uni.name}.jpg`,
        logo: `/logos/${uni.name}.png`,
        blurredLogo: `/blurredLogos/${uni.name}.png`,
      };
      let uniCategory = '';
      if (uni.category === 'Men') {
        uniCategory = t('universities:men');
      } else {
        uniCategory = t('universities:women');
      }
      uniObj.name = '(' + uniCategory + ') ' + uni.name;
      return uniObj;
    });
  }

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="m-auto">
          <Spinner size={12} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vw]">
      <div className="flex text-xs md:text-base ml-4 mb-4 mt-4">
        <span className="my-auto">
          <div className={'my-auto'}>{t('universities:search')}:</div>
          <DebounceInput
            debounceTimeout={1000}
            type="text"
            placeholder={
              t('universities:search') +
              ' ' +
              t('universities:uni_or_city_name') +
              ' ...'
            }
            value={searchNameOrCity || ''}
            className="xl:ml-0 max-w-xl text-sm md:text-base rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onChange={(e) => setSearchNameOrCity(e.target.value)}
          />
        </span>
        <span className="w-full md:w-1/3 my-auto">
          <SelectDropdown
            selected={selectedCategory}
            setSelected={setSelectedCategory}
            options={cateGoryOptions}
            label={t('universities:category')}
            className="ml-4 z-[12] mr-4"
            titleClassName="ml-4"
          />
        </span>
        <span className="w-1/3 my-auto hidden md:block">
          <SelectDropdown
            selected={selectedDivision}
            setSelected={setSelectedDivision}
            options={divisionOptions}
            label={t('universities:division')}
            className="z-[12]"
          />
        </span>
        <span className="w-2/3 my-auto mr-4 hidden md:block">
          <SelectDropdown
            selected={selectedConference}
            setSelected={setSelectedConference}
            options={conferenceOptions}
            label={t('universities:conference')}
            className="ml-4 z-[12]"
            titleClassName="ml-4"
          />
        </span>
      </div>
      <div className="flex text-xs md:text-base mb-4">
        <span className="w-1/3 ml-4">
          <SelectDropdown
            selected={selectedState}
            setSelected={setSelectedState}
            options={stateOptions}
            label={t('universities:state')}
            className="z-[11]"
          />
        </span>
        <span className="w-2/3 mr-4">
          <SelectDropdown
            selected={selectedRegion}
            setSelected={setSelectedRegion}
            options={regionOptions}
            label={t('universities:region')}
            className="ml-4 z-[11]"
            titleClassName="ml-4"
          />
        </span>
      </div>
      <div className="flex text-xs md:text-base mb-4 md:hidden">
        <span className="w-1/3 ml-4">
          <SelectDropdown
            selected={selectedDivision}
            setSelected={setSelectedDivision}
            options={divisionOptions}
            label={t('universities:division')}
            className="z-[10]"
          />
        </span>
        <span className="w-2/3 mr-4">
          <SelectDropdown
            selected={selectedConference}
            setSelected={setSelectedConference}
            options={conferenceOptions}
            label={t('universities:conference')}
            className="ml-4 z-[10]"
            titleClassName="ml-4"
          />
        </span>
      </div>
      {loadingUnis ? (
        <Spinner />
      ) : (
        <InfiniteScroll
          className="infinite-scroll-hide"
          dataLength={allUnis.length}
          next={fetchMoreData}
          hasMore={hasMore}
          endMessage={
            <span className="flex justify-center">
              <p className="p-4 max-auto text-slate-500">
                No more universities
              </p>
            </span>
          }
          loader={<Spinner />}
        >
          {chunk(searchedUnis, 3).map((uniChunk) => (
            <GalleryRow
              key={uniChunk[0].id}
              dataChunk={uniChunk}
              setAllUnis={setAllUnis}
              mine={mine}
              searchTerm={searchTerm}
            />
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
}
