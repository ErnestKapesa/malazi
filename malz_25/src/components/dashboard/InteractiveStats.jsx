import { Tooltip, Spinner } from '@chakra-ui/react'

export const InteractiveStats = ({ data, isLoading }) => {
  if (isLoading) {
    return <Spinner size="xl" color="brand.500" />
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
      <Tooltip 
        label="Click to see detailed property information" 
        placement="top"
      >
        <Box>
          <FeatureCard
            icon={FaHome}
            label="Properties"
            value={data.properties_count}
            subtext={`${data.properties_needing_attention} need attention`}
            badge={data.properties_needing_attention > 0 ? {
              color: 'red',
              text: 'Action needed'
            } : null}
            action={{
              label: 'View Details',
              icon: FaArrowRight,
              onClick: () => navigate('/properties')
            }}
          />
        </Box>
      </Tooltip>
      {/* Add more interactive stats... */}
    </SimpleGrid>
  )
} 