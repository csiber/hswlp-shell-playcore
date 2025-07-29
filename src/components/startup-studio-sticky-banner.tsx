'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Button } from './ui/button'
import { Input } from './ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { ChevronLeft, X } from 'lucide-react'

const STORAGE_KEY = 'agenticdev-studio-banner-collapsed'

const formSchema = z.object({
  email: z.string().email().optional(),
  description: z.string().min(1, 'Please describe the issue')
})

type FormValues = z.infer<typeof formSchema>

export function AgenticDevStudioStickyBanner() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', description: '' }
  })

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) {
      setIsCollapsed(JSON.parse(stored))
    }
    setIsHydrated(true)
  }, [])

  const toggleCollapsed = (value: boolean) => {
    setIsCollapsed(value)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  }

  const onSubmit = async (data: FormValues) => {
    const body = new FormData()
    body.append('description', data.description)
    if (data.email) body.append('email', data.email)
    if (file) body.append('screenshot', file)

    const res = await fetch('/api/report-bug', {
      method: 'POST',
      body
    })

    if (res.ok) {
      toast.success('Bug report sent')
      form.reset()
      setFile(null)
      setOpen(false)
    } else {
      toast.error('Failed to send bug report')
    }
  }

  if (!isHydrated) return null

  return (
    <div
      className={cn(
        'fixed bottom-4 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-4 z-[100] print:hidden',
        isCollapsed && 'pointer-events-none'
      )}
    >
      <div
        className={cn(
          'transition-all duration-300 ease-in-out transform',
          isCollapsed ? 'translate-x-[calc(100%+1rem)] md:translate-x-[calc(100%+1rem)]' : 'translate-x-0'
        )}
      >
        <div className="relative flex items-center w-[90vw] md:max-w-[400px]">
          <Button
            variant="outline"
            size="icon"
            className={cn(
              'absolute left-0 h-8 w-8 rounded-full shadow-lg -translate-x-full',
              'bg-background hover:bg-background',
              'border-2 hover:border-border',
              isCollapsed ? 'opacity-100 pointer-events-auto' : 'opacity-0'
            )}
            onClick={() => toggleCollapsed(false)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="bg-gray-100 dark:bg-background rounded-lg shadow-xl border-2 relative">
            <Button
              size="icon"
              className="h-6 w-6 absolute -top-3 -right-3 rounded-full shadow-md border border-border"
              onClick={() => toggleCollapsed(true)}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="flex items-center flex-col py-3 px-3">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">Report a bug</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Bug Report</DialogTitle>
                    <DialogDescription>
                      Please describe the issue clearly. Attach a screenshot if possible.
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email (optional)</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Input placeholder="What went wrong?" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-2">
                        <FormLabel>Screenshot</FormLabel>
                        <Input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
                        <FormDescription>Attach an image showing the issue.</FormDescription>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <DialogClose asChild>
                          <Button type="button" variant="outline">
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button type="submit">Send</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
