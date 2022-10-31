import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  const [search, setSearch] = useState('');

  const abortControllerRef = useRef(new AbortController());
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [count, setCount] = useState(24);

  var mine = !_res; // needs to be var to avoid scope errors

  const searchTerm = [
    search,
    selectedState.value,
    selectedConference.value,
    selectedDivision.value,
    selectedRegion.value,
    selectedCategory.value,
  ].join('***'); // just pick a unique value to join that matches the backend (didn't use coma since the values may contain comas). Any key is fine as long as the frontend values don't contain them

  const resetLength =
    queryClient.getQueryData([reactQueryKeys.universities, mine, searchTerm])
      ?.data.length || 24;
  const getUnis = mine ? getInterestedUniversities : getUniversities;
  const getUnisFunction = useCallback(
    async (limit, skip, search = '') => {
      const abortControllerRefCurrent = abortControllerRef.current;
      if (!(await Session.doesSessionExist())) {
        return await getPublicUniversities(
          limit,
          abortControllerRefCurrent,
          skip,
          search
        );
      }
      return await getUnis(limit, abortControllerRefCurrent, skip, search);
    },
    [getUnis]
  );

  const { data: uniData, isLoading: loading } = useQuery(
    [reactQueryKeys.universities, mine, searchTerm],
    () => getUnisFunction(resetLength, 0, searchTerm),
    {
      onSuccess: ({ data, status }) => {
        if (status === 200) {
          setAllUnis(data);
          setCount(resetLength);
          setHasMore(true);
        } else if (status == 404 || status == 422) {
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
      setCount(resetLength);
      setHasMore(true);
    }
  }, [mine, queryClient, resetLength, searchTerm]);

  useEffect(() => {
    if (count > allUnis.length) {
      setHasMore(false);
    }
  }, [count, allUnis.length]);

  const fetchMoreData = async () => {
    try {
      let res = await getUnisFunction(9, count, searchTerm);
      setCount((prevCount) => prevCount + 9);
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
    let transformedUnis = {};
    unis.map((uni, index) => {
      let uniObj = {
        ...uni,
        index: index,
        backgroundImage: `/backgrounds/${uni.name}.jpg`,
        blurredBackgroundImage: `/blurredBackgrounds/${uni.name}.jpg`,
        logo: `/logos/${uni.name}.png`,
        blurredLogo: `/blurredLogos/${uni.name}.png`,
      };
      if (uni.name in transformedUnis) {
        uniObj.name =
          `(${t('universities:men')}, ${t('universities:women')}) ` + uni.name;
        uniObj.category = 'Men, Women';
        uniObj.prev = transformedUnis[uni.name];
      } else {
        let uniCategory = '';
        if (uni.category === 'Men') {
          uniCategory = t('universities:men');
        } else {
          uniCategory = t('universities:women');
        }
        uniObj.name = '(' + uniCategory + ') ' + uni.name;
      }
      transformedUnis[uni.name] = uniObj;
    });

    return Object.keys(transformedUnis).map((k) => {
      return transformedUnis[k];
    });
  }

  // needs to use the "function" keyword to allow hoisting
  // function filterUni(unis, search) {
  //   let filteredUnis = unis;
  //   if (selectedCategory.value !== 'all') {
  //     filteredUnis = filteredUnis.filter(
  //       (uni) => uni.category.toLowerCase() === selectedCategory.value
  //     );
  //   }
  //   if (selectedConference.value !== 'all') {
  //     filteredUnis = filteredUnis.filter(
  //       (uni) => uni.conference.toLowerCase() === selectedConference.value
  //     );
  //   }
  //   if (selectedState.value !== 'all') {
  //     filteredUnis = filteredUnis.filter(
  //       (uni) => uni.state.toLowerCase() === selectedState.value
  //     );
  //   }
  //   if (selectedRegion.value !== 'all') {
  //     filteredUnis = filteredUnis.filter(
  //       (uni) => uni.region.toLowerCase() === selectedRegion.value
  //     );
  //   }
  //   if (selectedDivision.value !== 'all') {
  //     filteredUnis = filteredUnis.filter(
  //       (uni) => uni.division.toLowerCase() === selectedDivision.value
  //     );
  //   }
  //   search = search.toLowerCase();
  //   if (search !== '') {
  //     filteredUnis = filteredUnis.filter(
  //       (uni) =>
  //         uni.name.toLowerCase().includes(search) ||
  //         uni.city.toLowerCase().includes(search)
  //     );
  //   }
  //   // below code is used to optimistically remove unis from /myuniversities
  //   if (mine) {
  //     let i = 0;
  //     while (i < filteredUnis.length) {
  //       if (
  //         (!filteredUnis[i].interested && !filteredUnis[i].prev) ||
  //         (!filteredUnis[i].interested &&
  //           filteredUnis[i].prev &&
  //           !filteredUnis[i].prev.interested)
  //       ) {
  //         filteredUnis.splice(i, 1);
  //       } else {
  //         i++;
  //       }
  //     }
  //     if (filteredUnis.length === 0) document.body.style.overflow = 'unset';
  //   }
  //   return filteredUnis;
  // }

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
            value={search || ''}
            className="xl:ml-0 max-w-xl text-sm md:text-base rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onChange={(e) => setSearch(e.target.value)}
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
          dataLength={count}
          // next={() => {
          //   setSearchIndex((prev) => prev + 9);
          // }}
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
          {chunk(searchedUnis.slice(0, count), 3).map((uniChunk) => (
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
