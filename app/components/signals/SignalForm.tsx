'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignalSchema } from '@/lib/validation/signal'
import type { SignalFormData } from '@/lib/types'
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch
} from '@/components/ui'

interface SignalFormProps {
  onSubmit: (data: SignalFormData) => Promise<void>
  initialData?: Partial<SignalFormData>
}

export function SignalForm({ onSubmit, initialData }: SignalFormProps) {
  const form = useForm<SignalFormData>({
    resolver: zodResolver(SignalSchema),
    defaultValues: {
      satelliteName: initialData?.satelliteName || '',
      frequency: initialData?.frequency || 0,
      encryption: initialData?.encryption || false,
      ...initialData
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="satelliteName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Satellite Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frequency (MHz)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="polarization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Polarization</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select polarization" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="VERTICAL">Vertical</SelectItem>
                  <SelectItem value="HORIZONTAL">Horizontal</SelectItem>
                  <SelectItem value="LEFT_CIRCULAR">Left Circular</SelectItem>
                  <SelectItem value="RIGHT_CIRCULAR">Right Circular</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="encryption"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>Encryption</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <button type="submit" className="w-full btn btn-primary">
          Submit
        </button>
      </form>
    </Form>
  )
}